@echo off
REM Anaconda Python 需要这些 DLL 路径才能加载 ssl 模块
set PATH=C:\Users\Colar\anaconda3;C:\Users\Colar\anaconda3\Library\bin;C:\Users\Colar\anaconda3\Scripts;%PATH%
C:\Users\Colar\anaconda3\python.exe c:\Users\Colar\Desktop\agency-agents\scripts\trending_aggregator\aggregate.py >> c:\Users\Colar\Desktop\agency-agents\scripts\trending_aggregator\cron.log 2>&1
