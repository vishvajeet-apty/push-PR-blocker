import * as core from '@actions/core'
import {getS3Object} from './s3'
import {FrozenBranches} from './fileHandler'

import {
  branchName,
  bucketName,
  deploy_environment,
  targetBranch,
  event_type
} from './config'

export const eventType = core.getInput('EVENT_TYPE')

async function run(): Promise<void> {
  const s3FileKey = `assist/${deploy_environment}.json`
  let baseBranch = branchName
  if (event_type !== 'push') baseBranch = targetBranch
  core.info(` The base branch is ${baseBranch}`)

  let frozenBranches
  let isBranchPresent
  try {
    const frozenBranchData = await getS3Object(bucketName, s3FileKey)
    if (!frozenBranchData) {
      // there is no data available..
      // think about it
      core.info(
        'There is no data available about the deployed branches on production for this serive '
      )
    } else {
      isBranchPresent = FrozenBranches.FromJsonString(
        frozenBranchData.toString()
      ).hasBranch(baseBranch)

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
