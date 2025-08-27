import Image from "next/image";
import hk from "../../../public/hk.png";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "yosh",
  description: "höga kusten etapper",
};

export default function Page() {
  return (
    <div className="grid lg:grid-cols-2 gap-2">
      <div className="flex flex-col">
        <Image alt="hk" src={hk} sizes="100vw" className="w-full h-auto" />
      </div>
      <div className="text-lg px-2">
        <ul className="space-y-4">
          <li>
            <Span>0k-3k</Span>
            {` grusväg 100asc`}
          </li>
          <li>
            <Span>3k-10k </Span>
            {`trail 200desc, 200asc ish till "skuleskogs-toppen"`}
          </li>
          <li>
            <Span>10k-13k</Span>
            {` "downhill only" 250desc till kusten`}
          </li>
          <li>
            <Span>13k-17k</Span>
            {` längs kusten "flat" (station1 @ 15k)`}
          </li>
          <li>
            <Span>17k-21k</Span>
            {` "uphill only" 250asc till "skuleskogs-toppen"`}
            igen
          </li>
          <li>
            <Span>21k-24k</Span>
            {` "downhill only" 250desc till "kusten entre syd"`}
          </li>
          <li>
            <Span>24k-31k</Span>
            {` "trail" 100asc, 100desc ish (station2 @ 26k)`}
          </li>
          <li>
            <Span>31k-32k</Span>
            {` 150asc upp på getsvedjeberget`}
          </li>
          <li>
            <Span>32k-33k</Span>
            {` 200desc ner till civilisationen`}
          </li>
          <li>
            <Span>33k-37k</Span>
            {` "flat"`}
          </li>
          <li>
            <Span>37k-39k</Span>
            {` "uphill only" 250asc till "skuleberg-toppen" (station3 @ 38k)`}
          </li>
          <li>
            <Span>39k-42k</Span>
            {` "downhill only" 250desc till "startområdet"`}
          </li>
          <li>
            <Span>42k-44k</Span>
            {` "uphill only" 250asc till "skuleberg-toppen" igen (från andra hållet)`}
          </li>
        </ul>
      </div>
    </div>
  );
}

function Span({ children }: { children: React.ReactNode }) {
  return <span className="font-bold font-mono">{children}</span>;
}
