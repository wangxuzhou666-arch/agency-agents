"""数据源 registry：每个 module 导出一个 fetch(session, ua, timeout) -> List[TrendingItem]。

新增源 = 在本目录加文件 + 注册进 SOURCE_REGISTRY + 在 config.yaml 加配置。
"""
from .baidu import fetch as fetch_baidu
from .bilibili import fetch as fetch_bilibili
from .kaola import fetch_douyin, fetch_weibo, fetch_toutiao
from .zhihu import fetch as fetch_zhihu
from .hackernews import fetch as fetch_hackernews
from .producthunt import fetch as fetch_producthunt
from .google_trends import fetch_us as fetch_google_trends_us
from .x_trends import fetch_us as fetch_x_trends_us

# key 必须与 config.yaml 中 sources 的 key 完全一致
SOURCE_REGISTRY = {
    "baidu":            fetch_baidu,
    "bilibili":         fetch_bilibili,
    "kaola_douyin":     fetch_douyin,
    "kaola_weibo":      fetch_weibo,
    "kaola_toutiao":    fetch_toutiao,
    "zhihu":            fetch_zhihu,
    "hackernews":       fetch_hackernews,
    "producthunt":      fetch_producthunt,
    "google_trends_us": fetch_google_trends_us,
    "x_trends_us":      fetch_x_trends_us,
}
