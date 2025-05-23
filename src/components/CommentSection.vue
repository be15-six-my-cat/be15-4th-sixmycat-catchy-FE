<script setup>
import { ref, computed, onMounted } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { getComments, postComment, deleteComment } from '@/api/comment';
import { useAuthStore } from '@/stores/auth';

dayjs.extend(relativeTime);

const props = defineProps({
  targetId: Number,
  targetType: String,
});

const authStore = useAuthStore();
const currentUserId = computed(() => authStore.memberId); // 로그인 유저 ID
const comments = ref([]);
const newComment = ref('');
const replyingTo = ref(null);

const fetchComments = async () => {
  const { data } = await getComments(props.targetId, props.targetType, 1, 100);
  const flatList = data.data.content;
  flatList.forEach((c) => (c.showReplies = false)); // 반응성 보장
  comments.value = flatList;
};

onMounted(fetchComments);

const addComment = async () => {
  const text = newComment.value.trim();
  if (!text) return;

  await postComment(props.targetId, props.targetType, text, replyingTo.value, currentUserId);

  newComment.value = '';
  replyingTo.value = null;
  await fetchComments();
};

const deleteCommentHandler = async (commentId) => {
  await deleteComment(commentId, props.targetType, currentUserId);
  await fetchComments();
};

const handleReplyClick = (commentId, writer) => {
  replyingTo.value = commentId;
  newComment.value = writer ? `@${writer} ` : '';
};

const toggleReplies = (comment) => {
  const index = comments.value.findIndex((c) => c.commentId === comment.commentId);
  if (index === -1) {
    console.warn(`⚠️ commentId ${comment.commentId} not found in comments`);
    return;
  }

  // showReplies만 토글, replies는 filteredComments에서 계산
  const updated = { ...comments.value[index] };
  updated.showReplies = !updated.showReplies;

  // 교체
  comments.value.splice(index, 1, updated);

  console.log(`🔁 toggled replies for commentId: ${comment.commentId}`);
  console.log(`↪️ showReplies: ${updated.showReplies}`);
};

const formatMention = (text) => {
  return text.replace(/(@\S+)/g, '<span class="mention">$1</span>');
};

const filteredComments = computed(() => {
  const root = [];
  const map = {};

  comments.value.forEach((c) => {
    map[c.commentId] = {
      ...c,
      replies: c.replies || [],
      showReplies: c.showReplies ?? false, // 반드시 포함시킴
    };
  });

  comments.value.forEach((c) => {
    if (c.parentCommentId) {
      const parent = map[c.parentCommentId];
      const child = map[c.commentId];
      if (parent && child) {
        parent.replies.push(child);
      }
    } else {
      root.push(map[c.commentId]);
    }
  });

  console.log('✅ computed root:', root);
  console.log('📌 map:', map);

  return root;
});
</script>

<template>
  <div class="w-full h-full overflow-hidden border-none bg-white flex flex-col">
    <!-- 스크롤 가능 한 댓글 영역-->
    <div class="flex-1 overflow-y-auto p-4">
      <div class="flex flex-col gap-6">
        <div v-for="comment in filteredComments" :key="comment.commentId" class="text-sm">
          <div class="flex flex-col">
            <p class="flex items-center gap-2">
              <strong class="text-xs text-[#3e2f2f] font-bold">{{ comment.nickname }}</strong>
              <span class="text-xs text-gray-400">{{ dayjs(comment.createdAt).fromNow() }}</span>
              <button
                v-if="comment.memberId === currentUserId"
                @click="deleteCommentHandler(comment.commentId)"
                class="bg-none border-none text-gray-400 text-base leading-none px-1 ml-auto hover:text-red-500"
              >
                ×
              </button>
            </p>
            <p
              class="mt-0.5 text-[#555555] font-normal text-sm whitespace-pre-wrap"
              v-html="formatMention(comment.content)"
            ></p>
            <div class="flex gap-2 mt-1">
              <button
                @click="handleReplyClick(comment.commentId, comment.nickname)"
                class="bg-none border-none text-gray-400 text-xs cursor-pointer p-0 hover:underline"
              >
                답글 달기
              </button>
              <button
                v-if="comment.replies.length"
                @click="toggleReplies(comment)"
                class="bg-none border-none text-gray-400 text-xs cursor-pointer p-0 hover:underline"
              >
                {{ comment.showReplies ? '답글 숨기기' : '답글 보기' }}
              </button>
            </div>
          </div>

          <div v-if="comment.showReplies" class="ml-5 mt-2.5 flex flex-col gap-3">
            <div v-for="reply in comment.replies" :key="reply.commentId">
              <p class="flex items-center gap-2">
                <strong class="text-[#3e2f2f] text-xs font-bold">{{ reply.nickname }}</strong>
                <span class="text-xs text-gray-400">{{ dayjs(reply.createdAt).fromNow() }}</span>
                <button
                  v-if="reply.memberId === currentUserId"
                  @click="deleteCommentHandler(reply.commentId)"
                  class="bg-none border-none text-gray-400 text-base leading-none px-1 ml-auto hover:text-red-500"
                >
                  ×
                </button>
              </p>
              <p
                class="mt-0.5 text-[#555555] text-sm font-normal whitespace-pre-wrap"
                v-html="formatMention(reply.content)"
              ></p>
              <div class="flex gap-2 mt-1">
                <button
                  @click="handleReplyClick(comment.commentId, reply.nickname)"
                  class="bg-none border-none text-gray-400 text-xs cursor-pointer p-0 hover:underline"
                >
                  답글 달기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 입력창 -->
    <div class="flex gap-2 px-2 py-3 border-t border-gray-300">
      <input
        v-model="newComment"
        type="text"
        placeholder="댓글 달기..."
        @keyup.enter="addComment"
        class="flex-1 px-2 py-1.5 text-sm"
      />
      <button
        @click="addComment"
        :disabled="!newComment.trim()"
        class="bg-transparent border-none text-[#007bff] font-bold text-sm cursor-pointer disabled:text-gray-300 disabled:cursor-default"
      >
        게시
      </button>
    </div>
  </div>
</template>

<style scoped>
::v-deep(.mention) {
  color: #ff5c8d;
  font-size: 0.875rem;
  line-height: 1.25rem;
}
</style>
