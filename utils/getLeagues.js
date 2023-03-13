import { CargoClient } from "poro";

const cargo = new CargoClient();

async function getLeagues() {
  const response = await cargo.query({
    tables: ["Tournaments"],
    where: "Tournaments.Date > '2020-01-01 00:00:00'",
  });
  console.log(response);

  return response.data.map((league) => league._pageName);
}

export default getLeagues;
