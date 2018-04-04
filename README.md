[![Maintainability](https://api.codeclimate.com/v1/badges/36dd4efdd375a4b23b70/maintainability)](https://codeclimate.com/repos/5a4794df0602e102940006eb/maintainability)

# Features
- four pre-made custom color presets (green, blue, white and white/black)
- easy to create your own
- responsive deisgn - tablet, desktop and mobile UIs
- adjustable width: minimum width is 570px, there is no maximum (support for percentages included)
- supports autoplay (but can only autoplay on desktops due to mobile browsers' policies)
- explicit or implicit title: if not set, it will use what it finds in \<title\> tag
- explicit or implicit thumbnail: if not set, it will use what it finds in OG:Image property. An image with 1:1 aspect ratio is recommended. 
- quota warnings at 70%, 80% and 90%
- article focus
- listening time stats and demographics
- ability to be specific about content using CSS selectors
- numerous voices and supported languages
- ability to choose whether or not the audio should update on content change (i.e. should the podcast keep up to date with your article text or just serve the first version)
- graceful behaviour on package quota exhaustion: will continue serving existing podcasts and the widget will simply hide in case it's placed on a new article)
- for developers: widget(s) are exposed through `window.Read2Me.PlayerInstances` and the core backend API wrappers are exposed through `window.Read2Me.BackendWrapper` and `window.Read2Me.AnalyticsBackendWrapper`

# Browser support
- Tested in Chrome, Firefox, Edge, Opera and Safari
- No IE support, but will fail gracefully by simply not showing ([IE has a worldwide distribution of only 2.1% and decreasing](https://www.w3schools.com/browsers/browsers_explorer.asp)

# Advanced API usage
- Read2Me's API is publicly documented at https://swaggerhub.com/apis/Read2Me/convert/

# Credits
- design based on https://www.uplabs.com/posts/music-player-2814ecbb-e0e3-4de1-b488-364455ec8cc5
