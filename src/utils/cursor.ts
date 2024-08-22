export const decodeCursor = (cursor: string) => {
  const cursorString = Buffer.from(cursor, "base64").toString("utf-8");
  const parsedCursor = JSON.parse(cursorString);
  return parsedCursor;
};

export const encodeCursor = (params: { id: number }) => {
  const cursorString = JSON.stringify(params);
  return Buffer.from(cursorString).toString("base64");
};