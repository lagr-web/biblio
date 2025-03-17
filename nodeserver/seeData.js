//install: npm i @faker-js/faker
//run: node seeData.js //this file

import { MongoClient } from "mongodb";
import { faker } from "@faker-js/faker";

async function seedData() {
  const client = new MongoClient("mongodb://localhost:27017", { useUnifiedTopology: true });
  const sections = [
    { id: "673492b05f363e78e15ed1b8", name: "sport" },
    { id: "673492ca5f363e78e15ed1ba", name: "vejr" },
    { id: "673492d55f363e78e15ed1bb", name: "podcast" },
    { id: "673492e35f363e78e15ed1bc", name: "frontpage" },
  ];

  cardIdent = [];

  try {
    await client.connect();
    const db = client.db("news");
    const collection = db.collection("articlesp");

    const documents = [];

    sections.forEach((section) => {
      for (let i = 0; i < 10; i++) {
        const title = `${faker.company.catchPhrase()} (${section.name})`;
        const content = [
          { type: "paragraph", text: faker.lorem.paragraph() },
          { type: "paragraph", text: faker.lorem.paragraph() },
          { type: "image", url: faker.image.url(), altText: faker.lorem.words(5), caption: faker.lorem.sentence() },   
          { type: "link", url: faker.internet.url(), text: "Read more about this topic here." },
          
            {
              type:"main",
              contentbody:[
                {
                  headline:faker.lorem.sentence(),
                  text:faker.lorem.text()
                },
                {
                  headline:faker.lorem.sentence(),
                  text:faker.lorem.text()
                },
                {
                  headline:"",
                  text:faker.lorem.text()
                }
              ]

            }
          
        ];

        documents.push({
          title,
          content,
          section: section.id,
          slug: section.name,
          isLandingpage: section.name === "frontpage",
          tags:[],
          publishedAt: new Date(),
        });
      }
    });

    await collection.insertMany(documents);
    console.log("Data seeded successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

seedData();
