# Video Easter eggs 🔎

[![GitHub Workflow Status (checks)](https://img.shields.io/github/workflow/status/kachkaev/video-easter-eggs/Checks?label=checks)](https://github.com/kachkaev/video-easter-eggs/actions?query=workflow%3AChecks)

A [visual analytics](https://en.wikipedia.org/wiki/Visual_analytics) tool for finding [Easter eggs](<https://en.wikipedia.org/wiki/Easter_egg_(media)>) in videos

- inspired by <https://youtu.be/6g82FwQfpGc>
- deployed to [video-easter-eggs.now.sh](https://video-easter-eggs.now.sh)

## Working locally

1.  Clone the repo

1.  Install dependencies

    ```sh
    yarn install
    ```

1.  Run the probe command and install missing software if any problems are reported

    ```sh
    yarn exe src/commands/probe.ts
    ```

### Processing a video

1.  Copy `.env.dist` to `.env`, specify custom `VIDEO_ID` (e.g. `my-test-video`).

1.  Create `var/videos/my-test-video/config.yml` by following an example in the `var` directory.
    If you are not sure about some values, you can enter anything and revise later.

1.  Run these commands:

    ```sh
    yarn exe src/commands/videoProcessing/1-download.ts
    yarn exe src/commands/videoProcessing/2-extractFramePreviews.ts
    yarn exe src/commands/videoProcessing/3-extractFrameStripes.ts
    yarn exe src/commands/videoProcessing/4-joinFrameStripes.ts
    yarn exe src/commands/videoProcessing/5-extractLabeledSections.ts
    ```

1.  Create an empty yaml for the Easter eggs at `var/videos/my-test-video/labeledEasterEggs.yml`.
    You can start by copying some dummy entries from an example.

1.  Run a local server and manually populate the yaml with the Easter eggs.

### Running a local server

1.  Start the server

    ```sh
    yarn dev
    ```

1.  Navigate to your video page, e.g.:

    ```txt
    http://localhost:3000/my-test-video
    ```

### Generating an Easter egg summary

This command can be used to pre-generate a comment to the video:

```sh
yarn exe src/commands/videoProcessing/6-generateEasterEggSummary.ts
```

Once you’ve made a comment, you can specify the link to it in `var/videos/my-test-video/config.yml`.
The link will be displayed in the UI.

### Deployment

1.  Setup an S3 bucket with public read access

1.  Configure `S3_RESOURCE_STORAGE_*` variables in `.env`

1.  Upload applicable video-related resources to S3

    ```sh
    yarn exe src/commands/s3/uploadVideoData.ts
    yarn exe src/commands/s3/uploadVideoFramePreviews.ts
    ```

1.  Run the local server with `API_RESOURCE_STORAGE_TYPE=s3` to make sure the link between your bucket and the web app works

1.  Configure `S3_RESOURCE_STORAGE_*` and `API_RESOURCE_STORAGE_TYPE` in your deployment pipelines (e.g. in now.sh dashboard)

1.  Deploy 🚀 (it’s just a matter of pushing to GitHub in you have Zeit integration configured)

## Todo

- Show the list of Easter eggs

- Add index page + API route to get all video infos

- Find Easter eggs in more videos (suggestions welcome!)
