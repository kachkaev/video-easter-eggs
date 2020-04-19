# Video easter eggs

[![GitHub Workflow Status (checks)](https://img.shields.io/github/workflow/status/kachkaev/video-easter-eggs/Checks?label=checks)](https://github.com/kachkaev/video-easter-eggs/actions?query=workflow%3AChecks)

🔎 A visual analytics tool to find easter eggs in videos.
Inspired by https://www.youtube.com/watch?v=6g82FwQfpGc, deployed to [video-easter-eggs.now.sh](https://video-easter-eggs.now.sh)

## Working locally

1.  Clone the repo

1.  Install dependencies

    ```sh
    yarn install
    ```

1.  Run the probe command to detect missing software

    ```sh
    yarn exe src/commands/prope.ts
    ```

### Processing a video

1.  Copy `.env.dist` to `.env`, specify custom `VIDEO_ID` (e.g. `myTestVideo`).

1.  Create `var/videos/myTestVideo/config.yml` by following an example in the `var` directory.

1.  Run commands:

    ```sh
    yarn exe src/commands/videoProcessing/1-download.ts
    yarn exe src/commands/videoProcessing/2-extractFramePreviews.ts
    yarn exe src/commands/videoProcessing/3-extractFrameStripes.ts
    yarn exe src/commands/videoProcessing/4-joinFrameStripes.ts
    yarn exe src/commands/videoProcessing/5-extractLabeledSections.ts
    ```

1.  Run a local server and manually populate `var/videos/myTestVideo/labeledEasterEggs.yml`

### Running a local server

1.  Start the server

    ```
    yarn dev
    ```

1.  Navigate to your video page, e.g.:

    ```
    http://localhost:3000/myTestVideo
    ```

### Generating easter egg summary

This command can be used to pre-generate a comment to the video:

```sh
yarn exe src/commands/videoProcessing/6-generateEasterEggSummary.ts
```

Once you’ve commented, you can specify the link to your comment in `var/videos/myTestVideo/config.yml` so that it was displayed in the UI.

### Deployment

1.  Setup an S3 bucket, configure `S3_RESOURCE_STORAGE_*` variables in `.env`

1.  Upload video-related resources to S3

    ```
    yarn exe src/commands/s3/uploadVideoFramePreviews.ts
    yarn exe src/commands/s3/uploadVideoData.ts
    ```

1.  Run the local server with `API_RESOURCE_STORAGE_TYPE=s3` to make sure the link between your bucket and the web app works

1.  Configure `S3_RESOURCE_STORAGE_*` and `API_RESOURCE_STORAGE_TYPE` in your deployment pipelines (e.g. in now.sh dashboard)

1.  Deploy 🚀 (it’s just a matter of pushing to GitHub in you have Zeit integration configured)

## Todo

- Show the list of easter eggs

- Add index page + API route to get all video infos
