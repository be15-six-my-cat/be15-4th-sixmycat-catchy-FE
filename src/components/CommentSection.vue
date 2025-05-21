<script setup>
import { ref, computed } from 'vue';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

const props = defineProps({
  targetId: {
    type: Number,
    required: true,
  },
  targetType: {
    type: String,
    required: true,
    validator: (value) => ['FEED', 'JJURE'].includes(value),
  },
});

const currentUser = 'Catchy';

// 모든 게시글의 댓글 리스트 (더미)
const comments = ref([
  {
    id: 1,
    writer: 'day7s_official',
    text: '너무 귀여워요! 😺',
    createdAt: '2025-05-19 11:00:31',
    targetId: 1,
    targetType: 'FEED',
    replies: [
      {
        id: 101,
        writer: 'Catchy',
        text: '@day7s_official 고마워요!',
        createdAt: '2025-05-19 11:05:00',
      },
    ],
    showReplies: false,
  },
  {
    id: 2,
    writer: 'hang.vintage',
    text: '감사합니다!',
    createdAt: '2025-05-19 11:03:00',
    targetId: 2,
    targetType: 'JJURE',
    replies: [],
    showReplies: false,
  },
  {
    id: 3,
    writer: 'meowlover',
    text: '이 고양이 영상 어디서 볼 수 있나요?',
    createdAt: '2025-05-19 11:10:00',
    targetId: 1,
    targetType: 'FEED',
    replies: [
      {
        id: 102,
        writer: 'Catchy',
        text: '@meowlover 피드에서 확인할 수 있어요!',
        createdAt: '2025-05-19 11:12:00',
      },
      {
        id: 103,
        writer: 'day7s_official',
        text: '@meowlover 유튜브도 있어요!',
        createdAt: '2025-05-19 11:15:00',
      },
    ],
    showReplies: false,
  },
  {
    id: 4,
    writer: 'jellybean',
    text: '쮸르 너무 맛있어 보여요!',
    createdAt: '2025-05-19 11:20:00',
    targetId: 2,
    targetType: 'JJURE',
    replies: [
      {
        id: 104,
        writer: 'hang.vintage',
        text: '@jellybean 감사합니다 😊',
        createdAt: '2025-05-19 11:21:00',
      },
    ],
    showReplies: false,
  },
  {
    id: 5,
    writer: 'catperson',
    text: '쮸르 사러 갑니다~',
    createdAt: '2025-05-19 11:30:00',
    targetId: 2,
    targetType: 'JJURE',
    replies: [],
    showReplies: false,
  },
]);

const filteredComments = computed(() =>
  comments.value.filter((c) => c.targetId === props.targetId && c.targetType === props.targetType),
);

const newComment = ref('');
const replyingTo = ref(null);

function addComment() {
  const text = newComment.value.trim();
  if (!text) return;

  const now = dayjs().format('YYYY-MM-DD HH:mm:ss');
  const replyText = text;
  newComment.value = '';

  if (replyingTo.value !== null) {
    const parent = filteredComments.value.find((c) => c.id === replyingTo.value);
    if (parent) {
      parent.replies.push({
        id: Date.now(),
        writer: currentUser,
        text: replyText,
        createdAt: now,
      });
    }
    replyingTo.value = null;
  } else {
    comments.value.push({
      id: Date.now(),
      writer: currentUser,
      text: replyText,
      createdAt: now,
      targetId: props.targetId,
      targetType: props.targetType,
      replies: [],
      showReplies: false,
    });
  }
}

function handleReplyClick(parentId, replyWriter = null) {
  replyingTo.value = parentId;
  newComment.value = replyWriter ? `@${replyWriter} ` : '';
}

function toggleReplies(comment) {
  comment.showReplies = !comment.showReplies;
}

function formatMention(text) {
  return text.replace(/(@\S+)/g, '<span class="mention">$1</span>');
}

function deleteComment(commentId) {
  comments.value = comments.value.filter((c) => c.id !== commentId);
}

function deleteReply(parentId, replyId) {
  const parent = filteredComments.value.find((c) => c.id === parentId);
  if (parent) {
    parent.replies = parent.replies.filter((r) => r.id !== replyId);
  }
}
</script>

<template>
  <div class="w-[234px] h-[385px] border-none bg-white flex flex-col">
    <!-- 스크롤 가능한 댓글 영역 -->
    <div class="flex-1 overflow-y-auto p-2">
      <div class="flex flex-col gap-4">
        <div v-for="comment in filteredComments" :key="comment.id" class="text-sm">
          <div class="flex flex-col">
            <p class="flex items-center gap-2">
              <strong class="text-[#3e2f2f] font-bold">{{ comment.writer }}</strong>
              <span class="text-xs text-gray-400">{{ dayjs(comment.createdAt).fromNow() }}</span>
              <button
                v-if="comment.writer === currentUser"
                @click="deleteComment(comment.id)"
                class="bg-none border-none text-gray-400 text-base leading-none px-1 ml-auto hover:text-red-500"
              >
                ×
              </button>
            </p>
            <p
              class="mt-0.5 text-[#555555] font-normal whitespace-pre-wrap"
              v-html="formatMention(comment.text)"
            ></p>

            <div class="flex gap-2 mt-1">
              <button
                @click="handleReplyClick(comment.id, comment.writer)"
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
            <div v-for="reply in comment.replies" :key="reply.id">
              <p class="flex items-center gap-2">
                <strong class="text-[#3e2f2f] font-bold">{{ reply.writer }}</strong>
                <span class="text-xs text-gray-400">{{ dayjs(reply.createdAt).fromNow() }}</span>
                <button
                  v-if="reply.writer === currentUser"
                  @click="deleteReply(comment.id, reply.id)"
                  class="bg-none border-none text-gray-400 text-base leading-none px-1 ml-auto hover:text-red-500"
                >
                  ×
                </button>
              </p>
              <p
                class="mt-0.5 text-[#555555] font-normal whitespace-pre-wrap"
                v-html="formatMention(reply.text)"
              ></p>

              <div class="flex gap-2 mt-1">
                <button
                  @click="handleReplyClick(comment.id, reply.writer)"
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

    <!-- 댓글 입력창 -->
    <div class="flex gap-2 px-2 py-3 border-t border-gray-300">
      <input
        v-model="newComment"
        type="text"
        placeholder="댓글 달기..."
        @keyup.enter="addComment"
        class="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded"
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
}
</style>
