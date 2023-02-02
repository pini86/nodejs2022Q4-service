import { BadRequestException } from '@nestjs/common';
import { version as uuidVersion } from 'uuid';
import { validate as uuidValidate } from 'uuid';

const validateID = (uuid: string) => {
  if (!(uuidValidate(uuid) && uuidVersion(uuid) === 4)) {
    throw new BadRequestException('Error , invalid ID');
  }
};

export { validateID };
