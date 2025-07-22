import React, { useContext, useEffect, useState } from "react";
import { GameContext } from "../contexts/GameContext";

interface Entry {
  pseudo: string;
  elo: number;
}
const Leaderboard: React.FC = () => {
  const { socket } = useContext(GameContext);
  const [list, setList] = useState<Entry[]>([]);

  useEffect(() => {
    if (!socket) return;
    socket.emit("get-leaderboard");
    socket.on("leaderboard", (data: Entry[]) => setList(data));
    return () => {
      socket.off("leaderboard");
    };
  }, [socket]);

  return (
    <div className="p-4 bg-white rounded shadow w-full max-w-md mt-4">
      <h3 className="text-lg mb-2">Top joueurs</h3>
      <ol>
        {list.map((e, i) => (
          <li key={i}>
            {e.pseudo} - {e.elo}
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Leaderboard;
