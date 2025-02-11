# 使用 node 镜像
FROM node:18.12.0-alpine AS build-stage-node

# Set the maximum memory limit for the Node.js process
ENV NODE_OPTIONS="--max-old-space-size=10240"

## 安装 一些基础包
RUN apk update \
  && apk upgrade \
  && apk add git \
  && apk add bash

# ## 设置 操作系统时区
RUN rm -rf /etc/localtime \
  && ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime

# 设置容器内的目录，通常我们会使用 app 目录
WORKDIR /app

# 项目文件拷贝到容器 /app 下
COPY ./package.json .
COPY ./pnpm-lock.yaml .
COPY ./.npmrc .

RUN npm config set registry https://registry.npmmirror.com

RUN npm install -g pnpm@9.1.1

# 下载依赖包，并构建打包文件
RUN pnpm i --frozen-lockfile

COPY . .

RUN pnpm run build

# 使用 nginx 镜像
FROM harbor.123u.com/public/rocky9.1-nginx:latest

# 设置编码
ENV LANG C.UTF-8

# 同步时间
ENV TZ=Asia/Shanghai


# 将我们在 node 镜像的打包文件拷贝到这里
COPY --from=build-stage-node /app/dist /data/h5/

# 配置 nginx

ADD default.conf /etc/nginx/conf.d/
RUN mkdir -p /data/h5/ /data/logs/ && chmod -R a+x /data/h5/

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]




