# Features
- four pre-made custom color presets (green, blue, white and white/black), all of which are customizable
- analytics: easily figure out where are you dropping your readers by looking at `Focus Chart`, get playback stats and listener demographics
- responsive deisgn - tablet, desktop and mobile UIs
- adjustable width in any unit (e.g. `px` or `%`)
- supports autoplay (but can only autoplay on desktops due to mobile browsers' policies)
- explicit or implicit title: if not set, it will use what it finds in \<title\> tag
- explicit or implicit thumbnail: if not set, it will use what it finds in OG:Image property. An image with 1:1 aspect ratio is recommended. 
- quota warnings at 70%, 80% and 90% via email
- ability to be specific about content using CSS selectors
- numerous voices and supported languages
- ability to choose whether or not the audio should update on content change (i.e. should the podcast keep up to date with your article text or just serve the first version)
- graceful behaviour on package quota exhaustion: will continue serving existing podcasts and the widget will simply hide in case it's placed on a new article)
- for developers: widget(s) are exposed through `window.Read2Me.PlayerInstances` and the core backend API wrappers are exposed through `window.Read2Me.BackendWrapper` and `window.Read2Me.AnalyticsBackendWrapper`
- API is [publicly documented](https://swaggerhub.com/apis/Read2Me/)
- serve ads that are immune to adblockers

# Browser support
- Tested in Chrome, Firefox, Edge, Opera, Safari and Samsung Browser
- No IE support, but will fail gracefully by simply not showing ([IE has a worldwide distribution of only 2.1% and decreasing](https://www.w3schools.com/browsers/browsers_explorer.asp)

@TODO PLAYER screenshots

# Advanced API usage
@TODO snippets

# Credits
- standard design based on https://www.uplabs.com/posts/music-player-2814ecbb-e0e3-4de1-b488-364455ec8cc5
