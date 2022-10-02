import React from "react";
import Head from "next/head";
import { CargoClient } from "poro";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Flex,
  Tooltip,
} from "@chakra-ui/react";
import {
  useTable,
  useSortBy,
  useFilters,
  useGlobalFilter,
  useColumnOrder,
  useExpanded,
  useRowSelect,
} from "react-table";

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

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function SelectColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the options for filtering
  // using the preFilteredRows
  const options = React.useMemo(() => {
    const options = new Set();
    preFilteredRows.forEach((row) => {
      options.add(row.values[id]);
    });
    return [...options.values()];
  }, [id, preFilteredRows]);

  // Render a multi-select box
  return (
    <select
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {options.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function SliderColumnFilter({
  column: { filterValue, setFilter, preFilteredRows, id },
}) {
  // Calculate the min and max
  // using the preFilteredRows

  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    let max = preFilteredRows.length ? preFilteredRows[0].values[id] : 0;
    preFilteredRows.forEach((row) => {
      min = Math.min(row.values[id], min);
      max = Math.max(row.values[id], max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <>
      <input
        type="range"
        min={min}
        max={max}
        value={filterValue || min}
        onChange={(e) => {
          setFilter(parseInt(e.target.value, 10));
        }}
      />
      <button onClick={() => setFilter(undefined)}>Off</button>
    </>
  );
}

function NumberRangeColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) {
  const [min, max] = React.useMemo(() => {
    let min = preFilteredRows.length
      ? parseFloat(preFilteredRows[0].values[id])
      : 0;
    let max = preFilteredRows.length
      ? parseFloat(preFilteredRows[0].values[id])
      : 0;
    preFilteredRows.forEach((row) => {
      min = Math.min(parseFloat(row.values[id]), min);
      max = Math.max(parseFloat(row.values[id]), max);
    });
    return [min, max];
  }, [id, preFilteredRows]);

  return (
    <Flex direction="column">
      <input
        value={filterValue[0] || ""}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [
            val ? parseInt(val, 10) : undefined,
            old[1],
          ]);
        }}
        placeholder={`Min (${min})`}
        style={{
          width: "70px",
          marginRight: "0.5rem",
        }}
      />
      to
      <input
        value={filterValue[1] || ""}
        type="number"
        onChange={(e) => {
          const val = e.target.value;
          setFilter((old = []) => [
            old[0],
            val ? parseInt(val, 10) : undefined,
          ]);
        }}
        placeholder={`Max (${max})`}
        style={{
          width: "70px",
        }}
      />
    </Flex>
  );
}

const gradient = [
  "red.100",
  "red.200",
  "red.300",
  "red.400",
  "red.500",
  "green.500",
  "green.400",
  "green.300",
  "green.200",
  "green.100",
];

const IndeterminateCheckbox = React.forwardRef(
  ({ indeterminate, ...rest }, ref) => {
    const defaultRef = React.useRef();
    const resolvedRef = ref || defaultRef;

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate;
    }, [resolvedRef, indeterminate]);

    return (
      <>
        <input type="checkbox" ref={resolvedRef} {...rest} />
      </>
    );
  }
);
IndeterminateCheckbox.displayName = "IndeterminateCheckbox";

const CustomToolTip = ({ label, children }) => (
  <Tooltip label={label}>{children}</Tooltip>
);

export default function Home({ results }) {
  const filterTypes = React.useMemo(
    () => ({
      text: (rows, id, filterValue) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );
  const data = React.useMemo(() => results.data, [results.data]);
  const columns = React.useMemo(
    () => [
      {
        Header: () => null,
        id: "expander",
        Cell: ({ row }) => (
          <span {...row.getToggleRowExpandedProps()}>
            {row.isExpanded ? "👇" : "👉"}
          </span>
        ),
      },
      {
        Header: "Champion",
        accessor: "champion",
      },
      {
        Header: "Total Bans",
        accessor: "totalBans",
        Filter: NumberRangeColumnFilter,
        filter: "between",
      },
      {
        Header: "Total Picks",
        accessor: "totalPicks",
        Filter: NumberRangeColumnFilter,
        filter: "between",
      },
      {
        Header: "Presence",
        accessor: "presence",
        Filter: NumberRangeColumnFilter,
        filter: "between",
      },
      {
        Header: "Win Rate",
        accessor: "winRate",
        Filter: NumberRangeColumnFilter,
        filter: "between",
      },
      {
        Header: "Round 1 Bans",
        accessor: "round1Bans",
        Filter: NumberRangeColumnFilter,
        filter: "between",
      },
      {
        Header: "Round 1 Picks",
        accessor: "round1Picks",
        Filter: NumberRangeColumnFilter,
        filter: "between",
      },
      {
        Header: "Round 2 Picks",
        accessor: "round2Picks",
        Filter: NumberRangeColumnFilter,
        filter: "between",
      },
      {
        Header: "Round 3 Picks",
        accessor: "round3Picks",
        Filter: NumberRangeColumnFilter,
        filter: "between",
      },
      {
        Header: "Round 4 Picks",
        accessor: "round4Picks",
        Filter: NumberRangeColumnFilter,
        filter: "between",
      },
      {
        Header: "Round 2 Bans",
        accessor: "round2Bans",
        Filter: NumberRangeColumnFilter,
        filter: "between",
      },
      {
        Header: "Round 5 Picks",
        accessor: "round5Picks",
        Filter: NumberRangeColumnFilter,
        filter: "between",
      },
      {
        Header: "Round 6 Picks",
        accessor: "round6Picks",
        Filter: NumberRangeColumnFilter,
        filter: "between",
      },
      {
        Header: "Round 7 Picks",
        accessor: "round7Picks",
        Filter: NumberRangeColumnFilter,
        filter: "between",
      },
    ],
    []
  );
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        defaultColumn,
        filterTypes,
      },
      useColumnOrder,
      useFilters,
      useGlobalFilter,
      useSortBy,
      useExpanded,
      useRowSelect,
      (hooks) => {
        hooks.visibleColumns.push((columns) => [
          {
            id: "selection",
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ]);
      }
    );
  return (
    <div>
      <Head>
        <title>Worlds 2022 Champion Data</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <TableContainer>
          <Table {...getTableProps()} size="sm">
            <Thead>
              {headerGroups.map((headerGroup) => (
                <Tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
                  {headerGroup.headers.map((column) => {
                    let bgColor = "";
                    if (
                      column.id === "round1Picks" ||
                      column.id === "round3Picks" ||
                      column.id === "round6Picks"
                    ) {
                      bgColor = "blue.200";
                    } else if (
                      column.id === "round2Picks" ||
                      column.id === "round4Picks" ||
                      column.id === "round5Picks" ||
                      column.id === "round7Picks"
                    ) {
                      bgColor = "red.200";
                    }
                    return (
                      <Th key={column.id} bgColor={bgColor}>
                        <Box>
                          <span
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                          >
                            {column.render("Header")}
                            <span>
                              {column.isSorted
                                ? column.isSortedDesc
                                  ? " 🔽"
                                  : " 🔼"
                                : ""}
                            </span>{" "}
                          </span>

                          <span>
                            {column.id === "round1Bans" ? (
                              <CustomToolTip label="Bans for Blue/Red 1, 2, or 3">
                                <span>ℹ</span>
                              </CustomToolTip>
                            ) : null}
                            {column.id === "round2Bans" ? (
                              <CustomToolTip label="Bans for Blue/Red 4 or 5">
                                <span>ℹ</span>
                              </CustomToolTip>
                            ) : null}
                            {column.id === "round1Picks" ? (
                              <CustomToolTip label="Blue 1">
                                <span>ℹ</span>
                              </CustomToolTip>
                            ) : null}
                            {column.id === "round2Picks" ? (
                              <CustomToolTip label="Red 1 or 2">
                                <span>ℹ</span>
                              </CustomToolTip>
                            ) : null}
                            {column.id === "round3Picks" ? (
                              <CustomToolTip label="Blue 2 or 3">
                                <span>ℹ</span>
                              </CustomToolTip>
                            ) : null}
                            {column.id === "round4Picks" ? (
                              <CustomToolTip label="Red 3">
                                <span>ℹ</span>
                              </CustomToolTip>
                            ) : null}
                            {column.id === "round5Picks" ? (
                              <CustomToolTip label="Red 4">
                                <span>ℹ</span>
                              </CustomToolTip>
                            ) : null}
                            {column.id === "round6Picks" ? (
                              <CustomToolTip label="Blue 4 or 5">
                                <span>ℹ</span>
                              </CustomToolTip>
                            ) : null}
                            {column.id === "round7Picks" ? (
                              <CustomToolTip label="Red 5">
                                <span>ℹ</span>
                              </CustomToolTip>
                            ) : null}
                          </span>
                        </Box>
                        <Box>
                          {column.canFilter ? column.render("Filter") : null}
                        </Box>
                      </Th>
                    );
                  })}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()}>
              {rows.map((row) => {
                prepareRow(row);
                return (
                  <>
                    <Tr {...row.getRowProps()} key={row.id}>
                      {row.cells.map((cell) => {
                        if (cell.row.isSelected) {
                          if (
                            cell.column.id !== "champion" &&
                            cell.column.id !== "totalBans" &&
                            cell.column.id !== "totalPicks" &&
                            cell.column.id !== "expander" &&
                            cell.column.id !== "selection"
                          ) {
                            return (
                              <Td
                                key={cell.id}
                                backgroundColor={`hsl(260, 100%, 50%, .4)`}
                              >
                                {cell.render("Cell")}%
                              </Td>
                            );
                          }
                          return (
                            <Td
                              key={cell.id}
                              backgroundColor={`hsl(260, 100%, 50%, .4)`}
                            >
                              {cell.render("Cell")}
                            </Td>
                          );
                        }
                        if (
                          cell.column.id !== "champion" &&
                          cell.column.id !== "totalBans" &&
                          cell.column.id !== "totalPicks" &&
                          cell.column.id !== "expander" &&
                          cell.column.id !== "selection"
                        ) {
                          return (
                            <Td
                              key={cell.id}
                              backgroundColor={`hsl(${(
                                (cell.value / 100) *
                                120
                              ).toString(10)}, 100%, 50%, .4)`}
                            >
                              {cell.render("Cell")}%
                            </Td>
                          );
                        }
                        return <Td key={cell.id}>{cell.render("Cell")}</Td>;
                      })}
                    </Tr>
                    {row.isExpanded ? (
                      <>
                        <Tr>
                          <Td />
                          <Td>Top Picks</Td>
                          <Td>Jungle Picks</Td>
                          <Td>Mid Picks</Td>
                          <Td>Bot Picks</Td>
                          <Td>Support Picks</Td>
                        </Tr>
                        <Tr>
                          <Td />
                          <Td>{row.original.topPicks}%</Td>
                          <Td>{row.original.junglePicks}%</Td>
                          <Td>{row.original.midPicks}%</Td>
                          <Td>{row.original.botPicks}%</Td>
                          <Td>{row.original.supportPicks}%</Td>
                        </Tr>
                      </>
                    ) : null}
                  </>
                );
              })}
            </Tbody>
          </Table>
        </TableContainer>
      </main>

      <footer></footer>
    </div>
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
