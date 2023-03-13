import { CargoClient } from "poro";

const cargo = new CargoClient();

async function getResultsInOrder(league) {
  let results = [];
  let pb = await Promise.all([
    cargo.query({
      tables: ["PicksAndBansS7"],
      where: `OverviewPage = '${league}'`,
      orderBy: [{ field: "PicksAndBansS7._ID" }],
    }),
  ]);
  pb = pb.map((x) => x.data).flat();

  const drafts = pb.filter((p) => p.Team1Ban1 !== "null");

  for (const p of drafts) {
    results.push({
      team1Role1: p.Team1Role1,
      team1Role2: p.Team1Role2,
      team1Role3: p.Team1Role3,
      team1Role4: p.Team1Role4,
      team1Role5: p.Team1Role5,
      team2Role1: p.Team2Role1,
      team2Role2: p.Team2Role2,
      team2Role3: p.Team2Role3,
      team2Role4: p.Team2Role4,
      team2Role5: p.Team2Role5,
      team1Ban1: p.Team1Ban1,
      team1Ban2: p.Team1Ban2,
      team1Ban3: p.Team1Ban3,
      team1Ban4: p.Team1Ban4,
      team1Ban5: p.Team1Ban5,
      team2Ban1: p.Team2Ban1,
      team2Ban2: p.Team2Ban2,
      team2Ban3: p.Team2Ban3,
      team2Ban4: p.Team2Ban4,
      team2Ban5: p.Team2Ban5,
      team1Pick1: p.Team1Pick1,
      team1Pick2: p.Team1Pick2,
      team1Pick3: p.Team1Pick3,
      team1Pick4: p.Team1Pick4,
      team1Pick5: p.Team1Pick5,
      team2Pick1: p.Team2Pick1,
      team2Pick2: p.Team2Pick2,
      team2Pick3: p.Team2Pick3,
      team2Pick4: p.Team2Pick4,
      team2Pick5: p.Team2Pick5,
      team1: p.Team1,
      team2: p.Team2,
      winner: p.Winner,
      team1Score: p.Team1Score,
      team2Score: p.Team2Score,
      team1PicksByRoleOrder: p.Team1PicksByRoleOrder,
      team2PicksByRoleOrder: p.Team2PicksByRoleOrder,
      id: p._ID.toString(),
    });
  }

  const aggregatedStats = {};

  const createChampionStats = (champion) => {
    if (!aggregatedStats.hasOwnProperty(champion)) {
      aggregatedStats[champion] = {
        round1Bans: 0,
        round2Bans: 0,
        totalBans: 0,
        round1Picks: 0,
        round2Picks: 0,
        round3Picks: 0,
        round4Picks: 0,
        round5Picks: 0,
        round6Picks: 0,
        round7Picks: 0,
        totalPicks: 0,
        totalWins: 0,
        totalLosses: 0,
        presence: 0,
        topPicks: 0,
        junglePicks: 0,
        midPicks: 0,
        botPicks: 0,
        supportPicks: 0,
      };
    }
  };

  const handleBan = (ban, round) => {
    aggregatedStats[ban][round] += 1;
    aggregatedStats[ban].totalBans += 1;
    aggregatedStats[ban].presence += 1;
  };

  const handlePick = (pick, round, win) => {
    aggregatedStats[pick][round] += 1;
    aggregatedStats[pick].totalPicks += 1;
    aggregatedStats[pick].presence += 1;
    if (win) {
      aggregatedStats[pick].totalWins += 1;
    } else {
      aggregatedStats[pick].totalLosses += 1;
    }
  };

  const handleRole = (role, pick) => {
    aggregatedStats[pick][role] += 1;
  };

  const createChampionStatistics = (...champions) => {
    for (const champion of champions) {
      createChampionStats(champion);
    }
  };

  results.forEach((draft) => {
    createChampionStatistics(
      draft.team1Ban1,
      draft.team1Ban2,
      draft.team1Ban3,
      draft.team1Ban4,
      draft.team1Ban5,
      draft.team2Ban1,
      draft.team2Ban2,
      draft.team2Ban3,
      draft.team2Ban4,
      draft.team2Ban5,
      draft.team1Pick1,
      draft.team1Pick2,
      draft.team1Pick3,
      draft.team1Pick4,
      draft.team1Pick5,
      draft.team2Pick1,
      draft.team2Pick2,
      draft.team2Pick3,
      draft.team2Pick4,
      draft.team2Pick5
    );
    handleBan(draft.team1Ban1, "round1Bans");
    handleBan(draft.team1Ban2, "round1Bans");
    handleBan(draft.team1Ban3, "round1Bans");
    handleBan(draft.team1Ban4, "round2Bans");
    handleBan(draft.team1Ban5, "round2Bans");
    handleBan(draft.team2Ban1, "round1Bans");
    handleBan(draft.team2Ban2, "round1Bans");
    handleBan(draft.team2Ban3, "round1Bans");
    handleBan(draft.team2Ban4, "round2Bans");
    handleBan(draft.team2Ban5, "round2Bans");
    handlePick(
      draft.team1Pick1,
      "round1Picks",
      draft.team1Score > draft.team2Score
    );
    handlePick(
      draft.team1Pick2,
      "round3Picks",
      draft.team1Score > draft.team2Score
    );
    handlePick(
      draft.team1Pick3,
      "round3Picks",
      draft.team1Score > draft.team2Score
    );
    handlePick(
      draft.team1Pick4,
      "round6Picks",
      draft.team1Score > draft.team2Score
    );
    handlePick(
      draft.team1Pick5,
      "round6Picks",
      draft.team1Score > draft.team2Score
    );
    handlePick(
      draft.team2Pick1,
      "round2Picks",
      draft.team1Score < draft.team2Score
    );
    handlePick(
      draft.team2Pick2,
      "round2Picks",
      draft.team1Score < draft.team2Score
    );
    handlePick(
      draft.team2Pick3,
      "round4Picks",
      draft.team1Score < draft.team2Score
    );
    handlePick(
      draft.team2Pick4,
      "round5Picks",
      draft.team1Score < draft.team2Score
    );
    handlePick(
      draft.team2Pick5,
      "round7Picks",
      draft.team1Score < draft.team2Score
    );
    const roles = [
      "topPicks",
      "junglePicks",
      "midPicks",
      "botPicks",
      "supportPicks",
    ];
    draft.team1PicksByRoleOrder.split(",").forEach((pick, index) => {
      handleRole(roles[index], pick);
    });
    draft.team2PicksByRoleOrder.split(",").forEach((pick, index) => {
      handleRole(roles[index], pick);
    });
  });

  Object.keys(aggregatedStats).forEach((champion) => {
    if (aggregatedStats[champion].totalPicks > 0) {
      aggregatedStats[champion].winRate = (
        (aggregatedStats[champion].totalWins /
          aggregatedStats[champion].totalPicks) *
        100
      ).toFixed(2);
    } else {
      aggregatedStats[champion].winRate = 0;
    }
    Object.keys(aggregatedStats[champion]).forEach((key) => {
      if (key !== "winRate" && key !== "totalBans" && key !== "totalPicks") {
        if (
          key !== "topPicks" &&
          key !== "junglePicks" &&
          key !== "midPicks" &&
          key !== "botPicks" &&
          key !== "supportPicks"
        ) {
          aggregatedStats[champion][key] = (
            (aggregatedStats[champion][key] * 100) /
            results.length
          ).toFixed(2);
        } else {
          if (aggregatedStats[champion].totalPicks > 0) {
            aggregatedStats[champion][key] = (
              (aggregatedStats[champion][key] * 100) /
              aggregatedStats[champion].totalPicks
            ).toFixed(2);
          } else {
            aggregatedStats[champion][key] = 0;
          }
        }
      }
    });
  });

  const returnStats = Object.keys(aggregatedStats)
    .map((champion) => {
      return {
        champion,
        ...aggregatedStats[champion],
      };
    })
    .sort((a, b) => {
      return b.totalPicks - a.totalPicks;
    });

  return {
    data: returnStats,
    totalGames: results.length,
  };
}

export default getResultsInOrder;
