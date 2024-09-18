"use client";

import { useEffect, useRef, useState } from "react";

const limit = 20;

export default function List({ data }) {
  const stories = useRef(data);
  const page = useRef(1);
  const [showData, setShowData] = useState([]);

  const loader = useRef(null);

  const [loading, setloading] = useState(true);

  useEffect(() => {
    Promise.all(
      stories.current
        .slice(0, page.current * limit)
        .map((d) =>
          fetch(
            `https://hacker-news.firebaseio.com/v0/item/${d}.json?print=pretty`
          ).then((res) => res.json())
        )
    )
      .then((responses) => {
        setShowData(responses);
      })
      .finally(() => {
        setloading(false);
      });
  }, []);

  const fetchData = () => {
    setloading(true);

    page.current++;
    Promise.all(
      stories.current
        .slice(page.current * limit, page.current * limit + limit)
        .map((d) =>
          fetch(
            `https://hacker-news.firebaseio.com/v0/item/${d}.json?print=pretty`
          ).then((res) => res.json())
        )
    )
      .then((responses) => {
        setShowData((d) => {
          return [...d, ...responses];
        });
      })
      .finally(() => {
        setloading(false);
      });
  };

  useEffect(() => {
    if (!loader.current) return;

    const obs = new IntersectionObserver((entries) => {
      const [entry] = entries;
      if (entry.isIntersecting) {
        if (loading) return;
        fetchData();
      }
    });
    obs.observe(loader.current);

    return () => loader.current && obs.unobserve(loader.current);
  }, [loading]);

  return (
    <div className="p-4">
      {showData.map((d, idx) => (
        <div key={idx} className="my-3 shadow-sm rounded-lg">
          <p>title : {d.title}</p>
          <p>
            url :{" "}
            <a className="text-blue-500" href={d.url}>
              click here
            </a>
          </p>
        </div>
      ))}

      {loading && <div>loading...</div>}
      <div ref={loader}></div>
    </div>
  );
}
