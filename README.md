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

# API
- `data-app-id` - your App ID, **required**
- `data-url` - URL you are converting, **required**
- `data-css-selectors` - manually select content you want to convert to a podcast using CSS selectors. optional, defaults to an intelligent guess. example: `['h1', 'p.content']`
- `data-autoplay` - should the audio autoplay on page load? optional, default is _false_ (only works for desktop)
- `data-voice` - voice you want to use for podcast. optional, defaults to Matthew, an American male voice.
- `data-ignore-content-change` - optional. by default, the created podcast will keep in sync with any revisions you might do on an article. if you want to ignore those changes, set this attribute to _true_
- `data-title` - the title you want to use, only applies to Standard design. optional, defaults to page title
- `data-thumbnail` - URL to an image you want to display, only applies to Standard design. recommended is 1:1 ratio. optional, defaults to OG:Image, and if that is not set either, it'll use an Read2Me image.
- `data-theme` - color preset. optional, defaults to _white_. available presets are: white, gray, blue and green.
- `data-design` - design type. optional, defaults to _standard_. available choices are: standard, minimal
- `data-width` - sets a custom width for the widget. for standard design the minimum is 570 px, and for minimal 250 px. if you use a standard design but the container is less than 570px wide, it'll automatically apply the minimal design. optional, defaults to 570px for tablets and desktops and 100% for phones 
- `data-only-instantiate` - only use the widget code for validation, don't instantiate the player. this should be used when you don't want to use any of the available players, but instead you want to code your own solution against [the API](https://app.swaggerhub.com/apis/Read2Me/convert/1.0.0)). optional, defaults to false

# Browser support
- Tested in Chrome, Firefox, Edge, Opera, Safari and Samsung Browser
- No IE support, but will fail gracefully by simply not showing ([IE has a worldwide distribution of only 2.1% and decreasing](https://www.w3schools.com/browsers/browsers_explorer.asp)

@TODO PLAYER screenshots

# Advanced API usage
@TODO snippets

# Credits
- standard design based on https://www.uplabs.com/posts/music-player-2814ecbb-e0e3-4de1-b488-364455ec8cc5
