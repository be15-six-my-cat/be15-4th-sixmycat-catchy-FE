FROM ubuntu:latest
LABEL authors="psy_dev"

ENTRYPOINT ["top", "-b"]