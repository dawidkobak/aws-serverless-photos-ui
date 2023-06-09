# aws-serverless-photos-ui

## Demo:

https://dkobak-ns-1.s3.eu-central-1.amazonaws.com/index.html#/

Simple UI for application like Google Photos.

Functionalities (on AWS site):

- Upload photos to S3 bucket
- read phtos
- Cognito identity and access management
- Rekognition with labels detection on the photo

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Release on AWS (configuration aws cli required)

```sh
npm run release
```
