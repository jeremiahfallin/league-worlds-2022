import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

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
  Select,
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
import getResultsInOrder from "../utils/getResultsInOrder";
import getLeagues from "../utils/getLeagues";

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

export default function Home({ results, leagues }) {
  const router = useRouter();
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
        <Select
          placeholder="Select League"
          onChange={(e) => router.push(`/${e.target.value}`)}
        >
          {leagues.map((league) => (
            <option key={league} value={league}>
              {league}
            </option>
          ))}
        </Select>
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
                          <Td />
                          <Td>Top Picks</Td>
                          <Td>Jungle Picks</Td>
                          <Td>Mid Picks</Td>
                          <Td>Bot Picks</Td>
                          <Td>Support Picks</Td>
                        </Tr>
                        <Tr>
                          <Td />
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
  const allLeagues = await getLeagues();
  // filter out leagues other than LCS, LEC, LCK, LPL
  allLeagues.forEach((league) => {
    if (league.includes("World")) {
      console.log(league);
    }
  });
  const leagues = allLeagues.filter((league) => {
    return (
      league.includes("LCS/") ||
      league.includes("LEC/") ||
      league.includes("LCK/") ||
      league.includes("LPL/") ||
      league.includes("MSI/") ||
      league.includes("World")
    );
  });

  const REVALIDATE_TIMER = 60 * 10;
  return {
    props: { results: resultsOrdered, leagues },
    revalidate: REVALIDATE_TIMER,
  };
};
