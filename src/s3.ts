import {S3, config} from 'aws-sdk'
import * as core from '@actions/core'
import {countReset} from 'console'
import {AWSConfig} from './types/types'
const s3 = new S3({})

export const initAWS = (input: AWSConfig): void => {
  config.update({
    ...input
  })
}

export const getS3Object = async (
  bucketName: string,
  key: string
): Promise<S3.Body | undefined> => {
  return new Promise((res, rej) => {
    s3.getObject(
      {
        Bucket: bucketName,
        Key: key
      },
      async (err, data) => {
        if (err) {
          if (err.code !== 'NoSuchKey') {
            return rej(
              new Error(
                `Requested file with key: ${key}, Bucket: ${bucketName} not available - ${err}`
              )
            )
          }

          core.info('returning from error')
          return res(undefined)
        }
        core.info(JSON.stringify(data.Body?.toString()))
        if (data?.Body) {
          return res(data.Body)
        } else {
          return res(undefined)
        }
      }
    )
  })
}
