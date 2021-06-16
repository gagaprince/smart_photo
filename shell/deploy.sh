mainPid=$(ps -ef | grep node |grep -v grep |grep -v 'sh -c'|awk '{print $2}')
if [ ! -n "$mainPid" ] ;then
    echo "程序没有启动 不需要kill"
else
    kill -9 $mainPid
    echo "杀掉进程 $mainPid"
fi

nohup npm run start:prod & 