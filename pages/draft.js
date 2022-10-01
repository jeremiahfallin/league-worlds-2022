import React from "react";
import { Box, Flex, Heading } from "@chakra-ui/react";
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

  return results;
}

const DraftBox = ({ children, ...rest }) => {
  return (
    <Box
      h="50px"
      bg="gray.800"
      display="flex"
      justifyContent="center"
      alignItems="center"
      color="white"
      fontSize="xl"
      fontWeight="bold"
      {...rest}
    >
      {children}
    </Box>
  );
};

const DraftCard = ({ draft, winner, team1, team2 }) => {
  return (
    <Box
      w={"320px"}
      border={
        winner === team1
          ? "2px solid #00bfff"
          : winner === team2
          ? "2px solid #ff0000"
          : "2px solid #000000"
      }
    >
      <Flex justifyContent={"space-between"} p={2}>
        <Heading size="md">{team1}</Heading>
        <Heading size="md">{team2}</Heading>
      </Flex>

      <Flex justifyContent={"space-between"}>
        <Flex direction={"column"} justifyContent="center">
          <DraftBox borderColor="gray.700" borderWidth="2px">
            {draft.bb1} ⛔
          </DraftBox>
          <DraftBox
            borderRightColor="gray.700"
            borderRightWidth={1}
            borderLefttyle={"solid"}
            borderRightStyle={"solid"}
          >
            {draft.bb2} ⛔
          </DraftBox>
          <DraftBox borderColor="gray.700" borderWidth="2px">
            {draft.bb3} ⛔
          </DraftBox>
          <DraftBox border="2px solid" borderColor={"blue.500"}>
            {draft.b1}
          </DraftBox>
          <DraftBox
            borderRightWidth="2px"
            borderColor={"blue.500"}
            borderLeftWidth="2px"
          >
            {draft.b2}
          </DraftBox>
          <DraftBox
            borderRightWidth="2px"
            borderColor={"blue.500"}
            borderBottomWidth="2px"
            borderLeftWidth="2px"
          >
            {draft.b3}
          </DraftBox>
          <DraftBox borderColor="gray.700" borderWidth="2px">
            {draft.bb4} ⛔
          </DraftBox>
          <DraftBox
            borderColor="gray.700"
            borderLeftWidth="2px"
            borderRightWidth="2px"
            borderBottomWidth="2px"
          >
            {draft.bb5} ⛔
          </DraftBox>
          <DraftBox
            borderLeftWidth="2px"
            borderRightWidth="2px"
            borderColor={"blue.500"}
            borderTopWidth="2px"
          >
            {draft.b4}
          </DraftBox>
          <DraftBox
            borderRightWidth="2px"
            borderLeftWidth="2px"
            borderBottomWidth="2px"
            borderColor={"blue.500"}
          >
            {draft.b5}
          </DraftBox>
        </Flex>
        <Flex direction={"column"}>
          <DraftBox borderColor="gray.700" borderWidth="2px">
            ⛔ {draft.rb1}
          </DraftBox>
          <DraftBox borderRightColor="gray.700" borderLeftWidth={1}>
            ⛔ {draft.rb2}
          </DraftBox>
          <DraftBox borderColor="gray.700" borderWidth="2px">
            ⛔ {draft.rb3}
          </DraftBox>
          <DraftBox
            borderColor="red.500"
            borderTopWidth="2px"
            borderLeftWidth="2px"
            borderRightWidth="2px"
          >
            {draft.r1}
          </DraftBox>
          <DraftBox
            borderColor="red.500"
            borderBottomWidth="2px"
            borderLeftWidth="2px"
            borderRightWidth="2px"
          >
            {draft.r2}
          </DraftBox>
          <DraftBox
            borderColor="red.500"
            borderBottomWidth="2px"
            borderLeftWidth="2px"
            borderRightWidth="2px"
          >
            {draft.r3}
          </DraftBox>
          <DraftBox borderColor="gray.700" borderWidth="2px">
            ⛔ {draft.rb4}
          </DraftBox>
          <DraftBox
            borderColor="gray.700"
            borderLeftWidth="2px"
            borderRightWidth="2px"
            borderBottomWidth="2px"
          >
            ⛔ {draft.rb5}
          </DraftBox>
          <DraftBox borderColor="red.500" borderWidth="2px">
            {draft.r4}
          </DraftBox>
          <DraftBox
            borderColor="red.500"
            borderBottomWidth="2px"
            borderLeftWidth="2px"
            borderRightWidth="2px"
          >
            {draft.r5}
          </DraftBox>
        </Flex>
      </Flex>
    </Box>
  );
};

export default function DraftPage({ results }) {
  return (
    <main>
      <Flex gap={8} flexWrap={"wrap"} justifyContent={"center"} pt={4}>
        {results.map((r) => {
          return (
            <DraftCard
              key={r.id}
              draft={r.championDraft}
              winner={r.winner === 1 ? r.team1 : r.team2}
              team1={r.team1}
              team2={r.team2}
            />
          );
        })}
      </Flex>
    </main>
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
