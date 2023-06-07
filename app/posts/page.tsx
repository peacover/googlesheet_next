import { google } from 'googleapis';

async function getServerSideProps() {

    const auth = await google.auth.getClient({ scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'] });

    const sheets = google.sheets({ version: 'v4', auth });

    const range = `Sheet1!A2:C3`;

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range,
    });

    console.log("get data : ", process.env.SHEET_ID, " | " , range);
    console.log(response.data.values);

    // console.log(response.data.values);
    // if (response.data.values !== null && response.data.values !== undefined) {
    // const [title, content] : string[] = response.data.values[0];
    // console.log(title, content)

    // return { 
    //     props: {
    //         title,
    //         content
    //     } 
    // }
}


export default function Post() {
    getServerSideProps();
    return <article>
        {/* <h1>{title}</h1>
        <div>{content}</div> */}
        <h1>TEST</h1>
    </article>
}