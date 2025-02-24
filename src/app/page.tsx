import { Metadata } from "next";
import { Table } from "./table";

export const metadata: Metadata = {
  title: "Run like the wind",
  description: "calculate your paces",
};

export default function Page() {
  return <Table />;
}
