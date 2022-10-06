<p align="center">
  <a href="https://github.com/actions/typescript-action/actions"><img alt="typescript-action status" src="https://github.com/actions/typescript-action/workflows/build-test/badge.svg"></a>
</p>

# Create a JavaScript Action using TypeScript

Use this repository to run as a push and pull request blocker to an already deployed branch in production environment. It can be used as a job in one of the workflows present in Apty services(assist,account,etc)

This repository is purely written as a standard typescript action.

This action will fail if the user is trying to push or make a pull request to an already deployed brach in production env.

## Use this action in an apty service.

> In the workflow create a job which uses aptyInc/push-PR-blocker@main and provide the inputs mentioned below.

## Jab requirements.

          name: push-pr-blocker
          needs : [rules]
          runs-on: ubuntu-latest
          steps:
            - name: push-pr checkerrrr 
              uses: aptyInc/push-PR-blocker@main
              id: neverquit
              with:
                BRANCH_NAME: "${{needs.rules.outputs.branch_name}}"
                ENVIRONMENT_NAME: "C"
                BUCKET_NAME: "test-fh-dynamic-partitions-s3"
                REGION: "us-east-1"
                CONFIG_PATH: "./"
                TARGET_BRANCH: "${{github.event.pull_request.base.ref}}"
              env:
                AWS_ACCESS_KEY_ID: ${{secrets.AWS_ACCESS_KEY_ID}}
                AWS_SECRET_ACCESS_KEY: ${{secrets.AWS_SECRET_ACCESS_KEY}}


## Change action.yml

The action.yml defines the inputs and output for your action.

 
        name: 'push-PR-blocker'
        description: 'This repository will block the unwanted push and pull requests to the production deployed branches'
        author: 'Vishvajeet Singh'
        inputs:
          BRANCH_NAME:
            required: true
            description: "the name of the current branch"
          ENVIRONMENT_NAME:
            required: true
            description: "the name of the environment variable"
          BUCKET_NAME:
            required: true
            description: 'AWS S3 bucket to push the data'
          REGION:
            required: true
            description: 'AWS S3 bucket region'
          CONFIG_PATH:
            required: true
            description: 'Path to config file used in action'
          TARGET_BRANCH:
            required: true
            description: 'Target branch of PR'
  
        runs:
          using: 'node16'
          main: 'dist/index.js'


