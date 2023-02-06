import { BadRequestException } from '@nestjs/common';
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';
import { UUID_VER, Errors_Messages } from './constants';

const validateID = (uuid: string) => {
  if (!(uuidValidate(uuid) && uuidVersion(uuid) === UUID_VER)) {
    throw new BadRequestException(Errors_Messages.INVALID_UUID);
  }
};

export { validateID };
