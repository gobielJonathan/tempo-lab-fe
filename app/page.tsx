import Image from "next/image";
import List from "./list";

export default async function Home() {
  const stories = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty"
  ).then((res) => res.json());

  return (
    <div className="container mx-auto py-3">
      <h4 className="text-2xl">Hacker news</h4>
      <List data={stories} />
    </div>
  );
}
