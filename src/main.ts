import * as core from '@actions/core'
import {getS3Object} from './s3'
import {FrozenBranches} from './frozenBranches'

import {
  branchName,
  bucketName,
  deploy_environment,
  targetBranch
} from './config'

const event_type = process.env.GITHUB_EVENT_NAME
core.info('event_type: ' + event_type)
export const eventType = core.getInput('EVENT_TYPE')

async function run(): Promise<void> {
  const s3FileKey = `assist/${deploy_environment}.json`
  let baseBranch = branchName
  if (event_type !== 'push') baseBranch = targetBranch

  let frozenBranches
  let isBranchPresent

  try {
    const frozenBranchData = await getS3Object(bucketName, s3FileKey)
    if (frozenBranchData) {
      isBranchPresent = FrozenBranches.FromJsonString(
        frozenBranchData.toString()
      ).hasBranch(branchName)

      if (isBranchPresent) {
        core.setFailed(
          'You cannot push or make a Pull_request to a branch that is deployed in the production'
        )
      }
    }
  } catch (err) {
    core.setFailed(
      `Error while fetching details about the deployed branches from the S3 - ${err}`
    )
  }
}

run()
