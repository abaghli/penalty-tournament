import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const initialTeams = [
  "الفريق 1", "الفريق 2", "الفريق 3", "الفريق 4",
  "الفريق 5", "الفريق 6", "الفريق 7", "الفريق 8",
  "الفريق 9", "الفريق 10", "الفريق 11", "الفريق 12",
  "الفريق 13", "الفريق 14", "الفريق 15", "الفريق 16",
  "الفريق 17", "الفريق 18", "الفريق 19", "الفريق 20",
  "الفريق 21", "الفريق 22", "الفريق 23", "الفريق 24",
  "الفريق 25", "الفريق 26"
];

export default function BracketPage() {
  const [teams, setTeams] = useState(initialTeams);
  const [winners, setWinners] = useState(Array(22).fill(""));

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("winners");
      if (saved) {
        const parsed = JSON.parse(saved);
        const updatedWinners = [...winners];
        Object.keys(parsed).forEach((key) => {
          updatedWinners[parseInt(key)] = parsed[key];
        });
        setWinners(updatedWinners);
      }

      const handleStorageUpdate = () => {
        const saved = localStorage.getItem("winners");
        if (saved) {
          const parsed = JSON.parse(saved);
          const updatedWinners = [...winners];
          Object.keys(parsed).forEach((key) => {
            updatedWinners[parseInt(key)] = parsed[key];
          });
          setWinners(updatedWinners);
        }
      };

      window.addEventListener("storage", handleStorageUpdate);
      return () => window.removeEventListener("storage", handleStorageUpdate);
    }
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const renderMatch = (teamA, teamB, roundIndex, isFinal = false) => {
    const finalWinner = winners[roundIndex];
    const secondPlace = finalWinner === teamA ? teamB : finalWinner === teamB ? teamA : null;

    return (
      <Card className={`p-2 m-2 w-56 text-center ${isFinal ? "border-4 border-yellow-500 bg-yellow-50" : ""} print:border-none print:bg-white`}>
        <CardContent>
          <p className="mb-1 font-semibold text-lg">{teamA}</p>
          <div className="my-1 font-bold">ضد</div>
          <p className="mb-1 font-semibold text-lg">{teamB}</p>
          {finalWinner && (
            <p className="mt-2 text-sm text-green-600 font-bold">الفائز: {finalWinner}</p>
          )}
          {isFinal && finalWinner && (
            <>
              <p className="mt-4 text-lg text-yellow-700 font-extrabold">🥇 البطل: {finalWinner}</p>
              {secondPlace && (
                <p className="mt-2 text-base text-gray-700 font-semibold">🥈 المركز الثاني: {secondPlace}</p>
              )}
              {winners[19] && winners[20] && secondPlace && (
                <p className="mt-2 text-base text-orange-700 font-semibold">🥉 المركز الثالث: {
                  [winners[19], winners[20]].find(team => team !== finalWinner && team !== secondPlace) || "-"
                }</p>
              )}
            </>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-center text-2xl font-bold mb-6">🏆 بطولة الأمير للركلات الترجيحية</h1>
      <div className="flex justify-center mb-6 print:hidden">
        <Button onClick={handlePrint}>🖨️ طباعة النتائج</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center">
        {/* الجولة الأولى */}
        <div>
          <h2 className="text-center font-bold mb-2">الجولة الأولى</h2>
          {Array.from({ length: 13 }).map((_, i) => (
            renderMatch(teams[i * 2] || "BYE", teams[i * 2 + 1] || "BYE", i)
          ))}
        </div>

        {/* الجولة الثانية */}
        <div>
          <h2 className="text-center font-bold mb-2">ربع النهائي</h2>
          {Array.from({ length: 6 }).map((_, i) => (
            renderMatch(winners[i * 2] || "-", winners[i * 2 + 1] || "-", 13 + i)
          ))}
        </div>

        {/* نصف النهائي والنهائي */}
        <div>
          <h2 className="text-center font-bold mb-2">نصف النهائي والنهائي</h2>
          {renderMatch(winners[13] || "-", winners[14] || "-", 19)}
          {renderMatch(winners[15] || "-", winners[16] || "-", 20)}
          {renderMatch(winners[19] || "-", winners[20] || "-", 21, true)}
        </div>
      </div>
    </div>
  );
}
