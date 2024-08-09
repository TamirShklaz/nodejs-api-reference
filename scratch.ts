import {getTodosParams} from "./src/schemas/get-todos-params";

const params = {
    page_po: 3,
    page_lo: 2,
}

const res = getTodosParams.safeParse(params)
console.log(JSON.stringify(res))


function encodeCursor(cursor: { id: number; title: string }): string {
    const cursorString = JSON.stringify(cursor);
    return Buffer.from(cursorString).toString('base64');
}

console.log(encodeCursor({id: 283, title: "Do this dishes"}))