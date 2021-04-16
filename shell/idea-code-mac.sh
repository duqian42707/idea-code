#!/bin/zsh
# shell脚本无需安装依赖，直接运行即可
cd ~/Desktop/ && mkdir -p tmp-idea-code && cd tmp-idea-code && \
wget http://idea.medeming.com/jets/images/jihuoma.zip  && \
ditto -V -x -k  --sequesterRsrc --rsrc jihuoma.zip jihuoma && \
cd jihuoma/
echo ''
echo '------------------------IDEA CODE BEGIN-------------------'
cat *'之后'*
echo ''
echo '------------------------IDEA CODE END---------------------'
pbcopy < *'之后'*
echo '已复制到剪贴板,可直接粘贴'
cd ../../ && rm -fr tmp-idea-code