import { Box } from "@chakra-ui/react";
import { CargoClient } from "poro";

const cargo = new CargoClient();

async function getResultsInOrder() {
  let results = [];
  const pb = await cargo.query({
    tables: ["PicksAndBansS7"],
    where: "OverviewPage = '2022 Season World Championship/Play-In'",
    orderBy: [{ field: "PicksAndBansS7._ID" }],
  });

  const drafts = pb.data.filter((p) => p.Team1Ban1 !== "null");

  for (const p of drafts) {
    results.push({
      roleDraft: {
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
      },
      championDraft: {
        bb1: p.Team1Ban1,
        rb1: p.Team2Ban1,
        bb2: p.Team1Ban2,
        rb2: p.Team2Ban2,
        bb3: p.Team1Ban3,
        rb3: p.Team2Ban3,
        b1: p.Team1Pick1,
        r1: p.Team2Pick1,
        r2: p.Team2Pick2,
        b2: p.Team1Pick2,
        b3: p.Team1Pick3,
        r3: p.Team2Pick3,
        rb4: p.Team2Ban4,
        bb4: p.Team1Ban4,
        rb5: p.Team2Ban5,
        bb5: p.Team1Ban5,
        r4: p.Team2Pick4,
        b4: p.Team1Pick4,
        b5: p.Team1Pick5,
        r5: p.Team2Pick5,
      },
      team1: p.Team1,
      team2: p.Team2,
      winner: p.Winner,
      team1Score: p.Team1Score,
      team2Score: p.Team2Score,
      team1PicksByRoleOrder: p.Team1PicksByRoleOrder,
      team2PicksByRoleOrder: p.Team2PicksByRoleOrder,
      id: p._ID,
    });
  }

  let averageRoleDraftPosition = {
    blue: {
      Top: 0,
      Jungle: 0,
      Mid: 0,
      Bot: 0,
      Support: 0,
    },
    red: {
      Top: 0,
      Jungle: 0,
      Mid: 0,
      Bot: 0,
      Support: 0,
    },
  };

  results.forEach((r) => {
    averageRoleDraftPosition.blue[r.roleDraft.team1Role1] += 1;
    averageRoleDraftPosition.blue[r.roleDraft.team1Role2] += 2;
    averageRoleDraftPosition.blue[r.roleDraft.team1Role3] += 2;
    averageRoleDraftPosition.blue[r.roleDraft.team1Role4] += 3;
    averageRoleDraftPosition.blue[r.roleDraft.team1Role5] += 3;
    averageRoleDraftPosition.red[r.roleDraft.team2Role1] += 1;
    averageRoleDraftPosition.red[r.roleDraft.team2Role2] += 1;
    averageRoleDraftPosition.red[r.roleDraft.team2Role3] += 2;
    averageRoleDraftPosition.red[r.roleDraft.team2Role4] += 3;
    averageRoleDraftPosition.red[r.roleDraft.team2Role5] += 4;
  });

  for (const [key, value] of Object.entries(averageRoleDraftPosition.blue)) {
    averageRoleDraftPosition.blue[key] = (value / results.length).toFixed(2);
  }

  for (const [key, value] of Object.entries(averageRoleDraftPosition.red)) {
    averageRoleDraftPosition.red[key] = (value / results.length).toFixed(2);
  }

  return averageRoleDraftPosition;
}

export default function StatsPage({ results }) {
  return (
    <Box>
      <pre>{JSON.stringify(results, null, 2)}</pre>
    </Box>
  );
}

export const getStaticProps = async () => {
  const resultsOrdered = await getResultsInOrder();
  const REVALIDATE_TIMER = 60 * 10;
  return {
    props: { results: resultsOrdered },
    revalidate: REVALIDATE_TIMER,
  };
};
