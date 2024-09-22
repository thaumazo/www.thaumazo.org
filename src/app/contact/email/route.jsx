import Email from "@kenstack/forms/Email";
import { render } from "@react-email/render";
import { NextResponse } from "next/server";

import fields from "../fields";

const testData = new FormData();
testData.append("first_name", "Testy");
testData.append("last_name", "Mctestface");
testData.append("email", "testy@tester.com");

testData.append(
  "message",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum." +
    "\n\nfoo\n\n" +
    "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
);

testData.append("interest", "event");
testData.append("interest", "joining");
testData.append("interest", "partnering");
testData.append("interest", "support");

/*
    '\r\n' +
    '1914 translation by H. Rackham',
  details: 'Some text. ',
  project: [ 'StoryTime', 'CrisisForge', 'MakeAChange' ]
});
*/

export async function GET() {
  const html = await render(<Email fields={fields} formData={testData} />, {
    pretty: true,
  });

  return new NextResponse(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
