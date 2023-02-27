interface IAuthAnswer {
  accessToken: string;
  refreshToken: string;
}

type RefreshPayload = { id: string; type: string };

export { IAuthAnswer, RefreshPayload };
