# Soundweb 使用说明

这是一个基于 `React + Vite` 的小型交互网站项目。

网站目前有两个主要页面：

- 首页 `/`
  这是一个沉浸式进入页，带有 Ballpit 背景效果。
- 体验页 `/experience`
  用户可以选择当前状态、点击声音球体，并进入视觉化播放页面。

## 1. 你需要先准备什么

如果你是第一次接触前端项目，只需要先确认电脑里已经安装了：

- `Node.js`
- `npm`

你可以在终端里输入下面两个命令检查：

```bash
node -v
npm -v
```

如果都能输出版本号，就说明环境已经准备好了。

## 2. 第一次启动项目

先进入项目目录：

```bash
cd /Users/linus/Downloads/CodeProject/cassie-final
```

然后安装依赖：

```bash
npm install
```

安装完成后，启动开发服务器：

```bash
npm run dev
```

正常情况下，终端会出现类似下面的信息：

```bash
VITE v6.x.x  ready in ...
Local:   http://localhost:5173/
```

这时你只需要在浏览器里打开：

```text
http://localhost:5173/
```

就可以看到网站。

## 3. 声音素材应该放在哪里

音频文件需要放在项目里的这个目录：

[`public/audio`](/Users/linus/Downloads/CodeProject/cassie-final/public/audio)

也就是：

```text
cassie-final/
  public/
    audio/
```

如果你的项目里暂时还没有看到 `audio` 这个文件夹，也没关系，可以自己手动创建：

```text
public/audio
```

当前代码里已经固定使用了下面这些文件名，所以你放进去的音频文件名必须和下面完全一致：

- `rain.mp3`
- `ocean.mp3`
- `forest.mp3`
- `wind.mp3`
- `fire.mp3`
- `river.mp3`

你可以简单理解成下面这样：

| 页面里看到的声音 | 你需要准备的文件名 |
| --- | --- |
| Rain | `rain.mp3` |
| Ocean | `ocean.mp3` |
| Forest | `forest.mp3` |
| Wind | `wind.mp3` |
| Fire | `fire.mp3` |
| River | `river.mp3` |

放置完成后，目录应该类似这样：

```text
public/
  audio/
    rain.mp3
    ocean.mp3
    forest.mp3
    wind.mp3
    fire.mp3
    river.mp3
```

## 4. 如果你想替换声音

最简单的方法是：

1. 准备你自己的音频文件。
2. 把它们改名成项目要求的文件名。
3. 覆盖放到 [`public/audio`](/Users/linus/Downloads/CodeProject/cassie-final/public/audio) 目录里。

例如：

- 你想把“雨声”换成自己的素材，就把你的文件命名成 `rain.mp3`
- 你想把“海浪”换成自己的素材，就把你的文件命名成 `ocean.mp3`

这样代码不需要改，网站会直接读取新的文件。

建议你优先使用 `mp3` 文件。如果你手里是别的格式，比如 `wav`、`m4a`，最省事的方法是先在本地转换成 `mp3`，再按上面的文件名放进去。

## 5. 如果你想新增更多声音

如果你不只是替换，而是想新增新的声音种类，就不能只放文件，还需要改代码里的声音配置。

相关配置文件在这里：

[`src/data/sounds.ts`](/Users/linus/Downloads/CodeProject/cassie-final/src/data/sounds.ts)

这个文件决定了：

- 声音名称
- 对应的音频路径
- 球体颜色
- 球体渐变样式

如果你只是小白用户，只建议先用“替换同名文件”的方式，不建议直接改这里。

## 6. 声音放进去后为什么还是没响

常见原因有这几种：

### 原因 1：文件名不对

文件名必须和代码里写的一模一样，比如：

- `rain.mp3`
- 不是 `Rain.mp3`
- 也不是 `rain.MP3`

### 原因 2：文件放错目录

一定要放在：

[`public/audio`](/Users/linus/Downloads/CodeProject/cassie-final/public/audio)

不能放在别的文件夹里。

### 原因 3：浏览器阻止自动播放

有些浏览器会阻止网页一进入就自动播放声音。

如果你在页面里看到类似：

```text
Audio could not autoplay. Press play to start.
```

这是正常现象。

这时只需要点击页面上的：

- `Pause / Play Sound`

浏览器就会允许声音开始播放。

### 原因 4：你刚替换了文件，但浏览器还是旧声音

这是浏览器缓存导致的，属于正常情况。

你可以这样处理：

- 刷新页面一次
- 如果还不行，强制刷新浏览器
- 重新执行一次 `npm run dev`

## 7. 常用命令

启动开发环境：

```bash
npm run dev
```

运行测试：

```bash
npm test
```

打包生产版本：

```bash
npm run build
```

预览打包结果：

```bash
npm run preview
```

## 8. 推荐的最简单使用流程

如果你只是想把项目跑起来，可以直接按下面顺序做：

1. 打开终端并进入项目目录。
2. 执行 `npm install`。
3. 把 6 个音频文件放进 [`public/audio`](/Users/linus/Downloads/CodeProject/cassie-final/public/audio)。
4. 确认文件名分别是 `rain.mp3`、`ocean.mp3`、`forest.mp3`、`wind.mp3`、`fire.mp3`、`river.mp3`。
5. 执行 `npm run dev`。
6. 打开浏览器访问 `http://localhost:5173/`。
7. 进入体验页后点击声音球体测试播放。

## 9. 当前项目里几个你可能会用到的文件

- [`package.json`](/Users/linus/Downloads/CodeProject/cassie-final/package.json)
  用来看项目命令。
- [`public/audio`](/Users/linus/Downloads/CodeProject/cassie-final/public/audio)
  用来放声音文件。
- [`src/data/sounds.ts`](/Users/linus/Downloads/CodeProject/cassie-final/src/data/sounds.ts)
  用来看声音配置。
- [`src/pages/HomePage.tsx`](/Users/linus/Downloads/CodeProject/cassie-final/src/pages/HomePage.tsx)
  首页。
- [`src/pages/ExperiencePage.tsx`](/Users/linus/Downloads/CodeProject/cassie-final/src/pages/ExperiencePage.tsx)
  体验页。
