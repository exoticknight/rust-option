import fs from 'fs'
import {
  Option,
  Some,
  None,
  match,

  Result,
  Ok,
  Err,
} from './src'

function readFile():Result<string, string> {
  try {
    return Ok(fs.readFileSync('./tsconfig.json', 'utf-8'))
  } catch (error) {
    return Err('file not found')
  }
}

const str = readFile().unwrapOr('')

