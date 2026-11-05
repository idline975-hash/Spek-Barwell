/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Database,
  Search,
  Plus,
  FileSpreadsheet,
  FileJson,
  Upload,
  Trash2,
  Edit3,
  X,
  RotateCcw,
  SlidersHorizontal,
  Table as TableIcon,
  LayoutGrid,
  AlertCircle,
  Copy,
  ArrowUpDown,
  Sparkles,
  Layers,
  Wrench,
  Hash,
  Image as ImageIcon
} from 'lucide-react';

interface DataRow {
  comp: string;
  id: string;
  item: string;
  grm: string;
  detailGrm: string;
  dies: string;
}

const DEFAULT_DATA: DataRow[] = [
  // Original default data
  { comp: "EG", id: "4704", item: "CS 825", grm: "203", detailGrm: "", dies: "" },
  { comp: "E", id: "2523", item: "CS 695", grm: "9.5", detailGrm: "(112)", dies: "276 / CS 695 (-)" },
  { comp: "E", id: "2523", item: "CS 662", grm: "10.5", detailGrm: "(40)", dies: "CS 695 (-)" },
  { comp: "E", id: "2523", item: "CS 663", grm: "9.5", detailGrm: "", dies: "" },
  { comp: "E", id: "4354", item: "CS 78", grm: "46", detailGrm: "", dies: "Ø 35" },
  { comp: "E", id: "4354", item: "CS 34", grm: "15", detailGrm: "", dies: "TR 2" },
  { comp: "E", id: "2455", item: "CS 655", grm: "51", detailGrm: "", dies: "MC 13 (=)" },
  { comp: "E", id: "2605", item: "CS 35", grm: "16", detailGrm: "", dies: "Y 151" },
  { comp: "E", id: "4772", item: "CS 562", grm: "15", detailGrm: "", dies: "Ø 19" },
  { comp: "S", id: "2522", item: "CS 638", grm: "18", detailGrm: "(320)", dies: "CS 695" },
  { comp: "S", id: "2522", item: "CS 639", grm: "14", detailGrm: "(172)", dies: "CS 695" },
  { comp: "N", id: "2710", item: "CS 518", grm: "180", detailGrm: "", dies: "Ø 45" },
  { comp: "N", id: "2710", item: "CS 517", grm: "81", detailGrm: "", dies: "Ø 35" },
  { comp: "N", id: "2710", item: "CS 516", grm: "46", detailGrm: "", dies: "Ø 30" },
  { comp: "N", id: "2710", item: "CS 541", grm: "6", detailGrm: "", dies: "Ø 14" },
  { comp: "N", id: "2710", item: "CS 477", grm: "81", detailGrm: "", dies: "Ø 35" },
  { comp: "N", id: "2710", item: "CS 475", grm: "7", detailGrm: "", dies: "Ø 14" },
  { comp: "N", id: "2710", item: "CS 476", grm: "46", detailGrm: "(372)", dies: "Ø 30" },
  { comp: "N", id: "2710", item: "CS 484", grm: "182", detailGrm: "", dies: "Ø 45" },
  { comp: "N", id: "2710", item: "CS 459", grm: "15", detailGrm: "(220)", dies: "Ø 20" },
  { comp: "N", id: "2710", item: "CS 474", grm: "26", detailGrm: "", dies: "Ø 26" },
  { comp: "RA", id: "2727", item: "CS 687", grm: "240", detailGrm: "", dies: "Ø 65" },
  { comp: "RA", id: "2727", item: "CS 688", grm: "270", detailGrm: "", dies: "Ø 65" },
  { comp: "AG", id: "2711", item: "CS 511", grm: "43", detailGrm: "(200)", dies: "Ø" },
  { comp: "CS", id: "2903", item: "CS 634", grm: "41", detailGrm: "", dies: "Ø 35 (AIR BERSIH)" },
  { comp: "A", id: "2764", item: "CS 738", grm: "167", detailGrm: "(360)", dies: "276" },
  { comp: "AG", id: "2755", item: "CS 36", grm: "18-19", detailGrm: "(375)", dies: "Ø 18" },
  { comp: "AS", id: "2814", item: "CS 37", grm: "250", detailGrm: "", dies: "276" },

  // From Image: H DAN HO
  { comp: "E", id: "2645", item: "H 73", grm: "72", detailGrm: "(259)", dies: "H 73, H 72" },
  { comp: "E", id: "2645", item: "H 72", grm: "56", detailGrm: "", dies: "H 156, H 155" },
  { comp: "E", id: "4401", item: "H 156", grm: "70", detailGrm: "", dies: "H 156" },
  { comp: "E", id: "4401", item: "H 155", grm: "55", detailGrm: "", dies: "DT 107" },
  { comp: "E", id: "4401", item: "H 163", grm: "70", detailGrm: "", dies: "Ø 22" },
  { comp: "E", id: "2653", item: "H 298", grm: "35", detailGrm: "(367)", dies: "Ø 10 (AIR BERSIH)" },
  { comp: "E", id: "2653", item: "H 274", grm: "19.2", detailGrm: "(373)", dies: "276" },
  { comp: "E", id: "2658", item: "H 285", grm: "3.5", detailGrm: "", dies: "Y 151" },
  { comp: "E", id: "4573", item: "H 295", grm: "250", detailGrm: "", dies: "Y269" },
  { comp: "E", id: "4573", item: "HO 125", grm: "180", detailGrm: "(302)", dies: "H 62" },
  { comp: "E", id: "2539", item: "H 294", grm: "120", detailGrm: "", dies: "Ø 21" },
  { comp: "N", id: "2710", item: "H 194", grm: "37", detailGrm: "", dies: "H 52" },
  { comp: "N", id: "2810", item: "H 326", grm: "70", detailGrm: "(194)", dies: "TR 2" },
  { comp: "N", id: "2810", item: "H 338", grm: "72", detailGrm: "", dies: "HO 157" },
  { comp: "S", id: "2626", item: "H 62", grm: "44", detailGrm: "", dies: "276" },
  { comp: "", id: "2515", item: "H 60", grm: "16", detailGrm: "", dies: "DT 32" },
  { comp: "AS", id: "2814", item: "H 52", grm: "26-27", detailGrm: "", dies: "276" },
  { comp: "S", id: "2626", item: "HO 99", grm: "56", detailGrm: "", dies: "" },
  { comp: "E", id: "2653", item: "HO 157", grm: "83", detailGrm: "(175)", dies: "" },
  { comp: "E", id: "4500", item: "H 152", grm: "313±4", detailGrm: "(257)", dies: "" },
  { comp: "", id: "", item: "H 63", grm: "20-21", detailGrm: "", dies: "" },
  { comp: "SA", id: "2930", item: "H 29", grm: "250", detailGrm: "", dies: "" },

  // From Image: MT
  { comp: "E", id: "2665", item: "MT 146", grm: "140±21", detailGrm: "", dies: "Y 278 (378) / AIR BERSIH" },
  { comp: "E", id: "2539", item: "MT 128", grm: "8.2", detailGrm: "(289)", dies: "Ø 20" },
  { comp: "E", id: "2539", item: "MT 129", grm: "7", detailGrm: "(290)", dies: "MT 108" },
  { comp: "E", id: "2539", item: "MT 108", grm: "17", detailGrm: "(171)", dies: "Ø 20" },
  { comp: "E", id: "2539", item: "MT 117", grm: "6.5", detailGrm: "", dies: "TH 44" },
  { comp: "E", id: "2539", item: "MT 119", grm: "7", detailGrm: "", dies: "Ø 25" },
  { comp: "E", id: "2539", item: "MT 120", grm: "7.5", detailGrm: "", dies: "Ø 19" },
  { comp: "E", id: "2645", item: "MT 09", grm: "60", detailGrm: "", dies: "Ø 14" },
  { comp: "E", id: "2786", item: "MT 109", grm: "8.5", detailGrm: "", dies: "276" },
  { comp: "E", id: "2786", item: "MT 110", grm: "11", detailGrm: "(202)", dies: "Ø 26" },
  { comp: "E", id: "2786", item: "MT 118", grm: "5", detailGrm: "", dies: "Ø 19" },
  { comp: "E", id: "2786", item: "MT 122", grm: "3.5", detailGrm: "", dies: "Ø 14" },
  { comp: "E", id: "2786", item: "MT 127", grm: "3", detailGrm: "(322)", dies: "276" },
  { comp: "E", id: "4573", item: "MT 15", grm: "200", detailGrm: "", dies: "ADANYA DI TUNGYU" },
  { comp: "E", id: "4772", item: "MT 97-98", grm: "-", detailGrm: "", dies: "Ø 26" },
  { comp: "C", id: "2550", item: "MT 30", grm: "30", detailGrm: "", dies: "276" },
  { comp: "SA", id: "2685", item: "MT 33 CL", grm: "310", detailGrm: "(157)", dies: "Ø 21" },
  { comp: "SA", id: "2685", item: "MT 33 SP", grm: "305", detailGrm: "", dies: "Ø 22" },
  { comp: "AG", id: "4615", item: "MT 12", grm: "26", detailGrm: "", dies: "Ø 14" },
  { comp: "AG", id: "4615", item: "MT 13", grm: "31", detailGrm: "", dies: "Ø 17" },
  { comp: "AG", id: "2515", item: "MT 14", grm: "4.5", detailGrm: "", dies: "Ø 17" },
  { comp: "AG", id: "4615", item: "MT 28", grm: "9.6", detailGrm: "(113)", dies: "Ø 17 / Y 151" },
  { comp: "AG", id: "4615", item: "MT 29", grm: "11.8", detailGrm: "", dies: "" },
  { comp: "E", id: "2539", item: "MT 121", grm: "5.5", detailGrm: "(369)", dies: "" },
  { comp: "N", id: "2710", item: "MT 22", grm: "100", detailGrm: "", dies: "" },

  // From Image: TH
  { comp: "E", id: "1742", item: "TH 191", grm: "12", detailGrm: "(359)", dies: "" },
  { comp: "E", id: "1742", item: "TH 383", grm: "90±2", detailGrm: "", dies: "Ø 50" },
  { comp: "E", id: "2645", item: "TH 197", grm: "10", detailGrm: "", dies: "TH 197" },
  { comp: "E", id: "2645", item: "TH 453", grm: "200", detailGrm: "(330)", dies: "TH 44" },
  { comp: "E", id: "2555", item: "TH 200 CL", grm: "132", detailGrm: "", dies: "TH 44" },
  { comp: "E", id: "2555", item: "TH 200 SP", grm: "140", detailGrm: "", dies: "TH 44" },
  { comp: "E", id: "1000", item: "TH 223", grm: "85", detailGrm: "", dies: "Ø 60" },
  { comp: "E", id: "1000", item: "TH 222", grm: "85", detailGrm: "", dies: "Ø 65" },
  { comp: "E", id: "4573", item: "TH 466", grm: "65", detailGrm: "", dies: "Y 151" },
  { comp: "E", id: "4703", item: "TH 267", grm: "4.8", detailGrm: "", dies: "Ø 18" },
  { comp: "E", id: "2658", item: "TH 473", grm: "3.6", detailGrm: "", dies: "Ø 10" },
  { comp: "E", id: "2624", item: "TH 533", grm: "42-43", detailGrm: "(196)", dies: "TH 533 (AIR BERSIH)" },
  { comp: "A", id: "2621", item: "TH 161", grm: "21", detailGrm: "", dies: "Ø 21" },
  { comp: "AG", id: "2703", item: "TH 160", grm: "21", detailGrm: "", dies: "Ø 22" },
  { comp: "AG", id: "4615", item: "TH 37", grm: "22", detailGrm: "", dies: "Ø 25/26" },
  { comp: "AG", id: "2631", item: "TH 68", grm: "325", detailGrm: "(174)", dies: "276" },
  { comp: "S", id: "2626", item: "TH 155", grm: "16.5", detailGrm: "(332)", dies: "TR 2" },

  // From Image: SK
  { comp: "E", id: "2624", item: "SK 479", grm: "21", detailGrm: "", dies: "Y 151" },
  { comp: "E", id: "2624", item: "SK 441", grm: "90", detailGrm: "", dies: "276" },
  { comp: "E", id: "2665", item: "SK 321", grm: "46", detailGrm: "", dies: "Ø 27/26" },
  { comp: "E", id: "2665", item: "SK 24", grm: "250", detailGrm: "", dies: "276" },
  { comp: "E", id: "4354", item: "SK 332", grm: "38", detailGrm: "", dies: "Y 151" },
  { comp: "E", id: "4573", item: "SK 170", grm: "46", detailGrm: "", dies: "Ø 28" },
  { comp: "E", id: "4772", item: "SK 477", grm: "200", detailGrm: "", dies: "276" },
  { comp: "E", id: "4772", item: "SK 497", grm: "57", detailGrm: "", dies: "Y 151" },
  { comp: "E", id: "2780", item: "SK 25", grm: "50", detailGrm: "", dies: "Ø 27" },
  { comp: "E", id: "1742", item: "SK 215", grm: "50", detailGrm: "", dies: "DT 32" },
  { comp: "E", id: "2630", item: "SK 507", grm: "20", detailGrm: "(351)", dies: "Ø 21" },
  { comp: "N", id: "4645", item: "SK 245", grm: "150", detailGrm: "", dies: "276" },
  { comp: "AS", id: "4751", item: "SK 200", grm: "26", detailGrm: "", dies: "Ø 19" },
  { comp: "AG", id: "4615", item: "SK 27", grm: "46", detailGrm: "", dies: "Ø 26" },
  { comp: "AG", id: "2703", item: "SK 86", grm: "49", detailGrm: "", dies: "Ø 30" },
  { comp: "AG", id: "2711", item: "SK 26", grm: "300", detailGrm: "(379)", dies: "276" },
  { comp: "AG", id: "4615", item: "SK 03", grm: "250", detailGrm: "", dies: "276" },
  { comp: "SA", id: "2685", item: "SK 63", grm: "120±1", detailGrm: "(350)", dies: "SK 324" },
  { comp: "N", id: "2801", item: "SK 324", grm: "90±2", detailGrm: "(381)", dies: "SK 202" },
  { comp: "N", id: "2801", item: "SK 202", grm: "-", detailGrm: "", dies: "" },

  // From Image: Y
  { comp: "EG", id: "4704", item: "Y 53", grm: "250", detailGrm: "(324)", dies: "276" },
  { comp: "E", id: "1731", item: "Y 535A", grm: "125", detailGrm: "(348)", dies: "276" },
  { comp: "E", id: "1000", item: "Y 414", grm: "125", detailGrm: "(334)", dies: "TH 44" },
  { comp: "E", id: "1000", item: "Y 269", grm: "84", detailGrm: "", dies: "Y 269" },
  { comp: "E", id: "1000", item: "Y 281", grm: "145", detailGrm: "(361)", dies: "276" },
  { comp: "N", id: "4645", item: "Y 467", grm: "160", detailGrm: "", dies: "Y 269" },
  { comp: "N", id: "2661", item: "Y 377", grm: "8.8", detailGrm: "(62)", dies: "Ø 18" },
  { comp: "N", id: "2822", item: "Y 408", grm: "36", detailGrm: "", dies: "Ø 35" },
  { comp: "N", id: "2601", item: "Y 212", grm: "3.4", detailGrm: "", dies: "Ø 10" },
  { comp: "N", id: "4701", item: "Y 346", grm: "8.2", detailGrm: "", dies: "Ø 19" },
  { comp: "N", id: "2910", item: "Y 86", grm: "80±1", detailGrm: "", dies: "Y 86" },
  { comp: "N", id: "2910", item: "Y 388", grm: "45", detailGrm: "", dies: "Y 269" },
  { comp: "N", id: "2810", item: "Y 223", grm: "505±2", detailGrm: "", dies: "276" },
  { comp: "N", id: "2710", item: "Y 118", grm: "175", detailGrm: "", dies: "" },
  { comp: "N", id: "2510", item: "Y 48", grm: "120", detailGrm: "", dies: "Y 138" },
  { comp: "EG", id: "2804", item: "Y 138", grm: "60", detailGrm: "(17)", dies: "276" },
  { comp: "EG", id: "2804", item: "Y 47", grm: "160", detailGrm: "(129)", dies: "276" },
  { comp: "EG", id: "4704", item: "Y 40", grm: "230", detailGrm: "(272)", dies: "Ø 21" },
  { comp: "As", id: "4751", item: "Y 12 (LAMA)", grm: "92", detailGrm: "", dies: "Ø 20" },
  { comp: "As", id: "4751", item: "Y 203", grm: "42", detailGrm: "(27)", dies: "Ø 21" },
  { comp: "As", id: "2707", item: "Y 12 (BARU)", grm: "44", detailGrm: "", dies: "Y 314" },
  { comp: "As", id: "2814", item: "Y 314", grm: "46", detailGrm: "", dies: "Y 316" },
  { comp: "As", id: "2814", item: "Y 316", grm: "46", detailGrm: "", dies: "Ø 20" },
  { comp: "As", id: "4751", item: "Y 148", grm: "42", detailGrm: "", dies: "Y 151" },
  { comp: "E", id: "2645", item: "Y 481", grm: "27±2", detailGrm: "(356)", dies: "Y 138" },
  { comp: "E", id: "2645", item: "Y 303", grm: "74±0.2", detailGrm: "(364)", dies: "TH 44" },
  { comp: "E", id: "2645", item: "Y 269", grm: "83±0.5", detailGrm: "(376)", dies: "" },

  // From Additional Image: PJ & IC
  { comp: "C", id: "2605", item: "PJ 310", grm: "10.2-10.4", detailGrm: "(352)", dies: "Ø 14 (ANTITAK SEDIKIT AIR BERSIH)" },
  { comp: "N", id: "2710", item: "IC 127", grm: "40-41", detailGrm: "(355)", dies: "Ø 14 (AIR BERSIH)" },

  // From Additional Image: DT
  { comp: "EG", id: "2804", item: "DT 62", grm: "295", detailGrm: "", dies: "276" },
  { comp: "EG", id: "2804", item: "DT 145", grm: "51", detailGrm: "", dies: "Ø 45" },
  { comp: "EG", id: "2804", item: "DT 104", grm: "48", detailGrm: "", dies: "Ø 45" },
  { comp: "EG", id: "2804", item: "DT 33", grm: "38", detailGrm: "", dies: "TH 44" },
  { comp: "AG", id: "4615", item: "DT 114", grm: "190", detailGrm: "", dies: "276" },
  { comp: "AS", id: "2828", item: "DT 180", grm: "27-28", detailGrm: "(316)", dies: "Ø 30" },
  { comp: "N", id: "2600", item: "DT 32 CL", grm: "22", detailGrm: "", dies: "DT 32 / ND 277 278" },
  { comp: "N", id: "2600", item: "DT 32 Y6", grm: "21", detailGrm: "", dies: "DT 32 / ND 277 278" },
  { comp: "N", id: "2600", item: "DT 177", grm: "22", detailGrm: "", dies: "ND 277/278" },
  { comp: "N", id: "2722", item: "DT 82", grm: "8.8", detailGrm: "", dies: "Ø 21" },

  // From Additional Image: ND
  { comp: "AG", id: "4615", item: "ND 299", grm: "12", detailGrm: "(325)", dies: "Ø 26" },
  { comp: "E", id: "2645", item: "ND 08", grm: "2.5", detailGrm: "(253)", dies: "Ø 14" },
  { comp: "E", id: "2638", item: "ND 351", grm: "3.8", detailGrm: "", dies: "ND 351" },
  { comp: "E", id: "2638", item: "ND 352", grm: "2.2", detailGrm: "", dies: "DT 32" },
  { comp: "E", id: "2638", item: "ND 350", grm: "4.5", detailGrm: "", dies: "ND 351" },
  { comp: "E", id: "2638", item: "ND 368", grm: "2.6", detailGrm: "", dies: "DT 32" },
  { comp: "E", id: "2638", item: "ND 386", grm: "4.2", detailGrm: "", dies: "DT 32" },
  { comp: "E", id: "2638", item: "ND 334", grm: "3.2", detailGrm: "", dies: "" },
  { comp: "E", id: "2638", item: "ND 278", grm: "4.3", detailGrm: "", dies: "DT 32" },
  { comp: "E", id: "2638", item: "ND 277", grm: "4.5", detailGrm: "", dies: "TR 2 (AIR BERSIH)" },
  { comp: "E", id: "2630", item: "ND 263 Y6", grm: "6.5", detailGrm: "(217)", dies: "TR 2" },
  { comp: "E", id: "2630", item: "ND 263 CL", grm: "7.5-8", detailGrm: "(135)", dies: "TH 44" },
  { comp: "E", id: "4504", item: "ND 390", grm: "130", detailGrm: "", dies: "TR 2" },
  { comp: "E", id: "2421", item: "ND 337", grm: "4.5", detailGrm: "(344)", dies: "TH 44" },
  { comp: "E", id: "4354", item: "ND 367", grm: "75", detailGrm: "(365)", dies: "276" },
  { comp: "E", id: "2645", item: "ND 113", grm: "230", detailGrm: "", dies: "TR 2 (AIR BERSIH)" },
  { comp: "E", id: "2539", item: "ND 339", grm: "21", detailGrm: "", dies: "TR 2" },
  { comp: "S", id: "2626", item: "ND 01", grm: "28", detailGrm: "", dies: "" },

  // From Additional Image: YY / Y
  { comp: "E", id: "2645", item: "Y 137", grm: "240", detailGrm: "", dies: "276" },
  { comp: "E", id: "2645", item: "Y 02", grm: "340", detailGrm: "(254)", dies: "276" },
  { comp: "E", id: "2645", item: "Y 339", grm: "16.5", detailGrm: "", dies: "TR 2" },
  { comp: "E", id: "2645", item: "Y 227", grm: "52", detailGrm: "", dies: "Y 151" },
  { comp: "E", id: "2645", item: "Y 50", grm: "110", detailGrm: "", dies: "276" },
  { comp: "E", id: "2645", item: "Y 39", grm: "105", detailGrm: "", dies: "TH 44" },
  { comp: "E", id: "2645", item: "Y 199", grm: "22", detailGrm: "", dies: "TR 2" },
  { comp: "E", id: "2645", item: "Y 501", grm: "32", detailGrm: "", dies: "TR 2" },
  { comp: "E", id: "2645", item: "Y 42", grm: "175", detailGrm: "", dies: "276" },
  { comp: "E", id: "2645", item: "Y 27", grm: "60", detailGrm: "(243)", dies: "TH 44" },
  { comp: "E", id: "2645", item: "Y 58", grm: "335±5", detailGrm: "(337)", dies: "276" },
  { comp: "E", id: "2645", item: "Y 218", grm: "84", detailGrm: "(341)", dies: "Y 269" },
  { comp: "E", id: "2619", item: "Y 25", grm: "232", detailGrm: "(242)", dies: "276" },
  { comp: "E", id: "2619", item: "Y 70", grm: "77", detailGrm: "", dies: "Y 70" },
  { comp: "E", id: "2619", item: "Y 51", grm: "140", detailGrm: "(313)", dies: "276" },
  { comp: "E", id: "2624", item: "Y 191", grm: "41", detailGrm: "", dies: "Ø 26" },
  { comp: "E", id: "2624", item: "Y 224", grm: "30", detailGrm: "", dies: "Y 224" },
  { comp: "E", id: "2624", item: "Y 225", grm: "23-25", detailGrm: "", dies: "Y 151" },
  { comp: "E", id: "4401", item: "Y 166", grm: "120", detailGrm: "", dies: "TH 44" },
  { comp: "E", id: "4772", item: "Y 396", grm: "240", detailGrm: "", dies: "276" },
  { comp: "E", id: "4772", item: "Y 389", grm: "42", detailGrm: "", dies: "SC 24" },
  { comp: "E", id: "4772", item: "Y 317", grm: "195", detailGrm: "", dies: "276" },
  { comp: "E", id: "2653", item: "Y 325", grm: "9", detailGrm: "", dies: "Y 325" },
  { comp: "E", id: "4593", item: "Y 460", grm: "65", detailGrm: "", dies: "Y 151" },
  { comp: "E", id: "2624", item: "Y 176", grm: "275", detailGrm: "", dies: "276" },

  // From Latest Batch Images: TR (IMG20260924083924_01475f33.jpg)
  { comp: "E", id: "4573", item: "TR 12", grm: "50±5", detailGrm: "(326)", dies: "TH 44" },
  { comp: "S", id: "2626", item: "TR 02 (CL)", grm: "33", detailGrm: "(207)", dies: "TR 2" },
  { comp: "S", id: "2626", item: "TR 02 (YG)", grm: "30", detailGrm: "(104)", dies: "TR 2" },
  { comp: "AG", id: "4615", item: "TR 17", grm: "23", detailGrm: "", dies: "Ø 19" },

  // From Latest Batch Images: TB (IMG20260924083926_f76ea0e1.jpg)
  { comp: "E", id: "4354", item: "TB 76", grm: "40", detailGrm: "(284)", dies: "TH 44" },
  { comp: "E", id: "4354", item: "TB 78", grm: "113-114", detailGrm: "(170)", dies: "MC 13" },
  { comp: "E", id: "2645", item: "TB 72", grm: "195", detailGrm: "(186)", dies: "276" },
  { comp: "E", id: "2514", item: "TB 49", grm: "105", detailGrm: "(366)", dies: "TH 44" },
  { comp: "AG", id: "2720", item: "TB 47", grm: "15", detailGrm: "", dies: "Ø 21" },
  { comp: "AG", id: "4615", item: "TB 11", grm: "25", detailGrm: "", dies: "Ø 21" },

  // From Latest Batch Images: Dan Lain Lain (IMG20260924083935_cb2b7bdb.jpg)
  { comp: "E", id: "4573", item: "HF 36 ML/YG", grm: "2.3", detailGrm: "(349)", dies: "Ø 14" },
  { comp: "E", id: "4573", item: "HF 36 CL", grm: "2.5", detailGrm: "", dies: "Ø 14" },
  { comp: "E", id: "4573", item: "HF 37", grm: "1.5", detailGrm: "(252)", dies: "Ø 14" },
  { comp: "E", id: "4573", item: "KB 07", grm: "165", detailGrm: "(314)", dies: "276" },
  { comp: "E", id: "4573", item: "IC 007", grm: "50", detailGrm: "", dies: "TH 44" },
  { comp: "E", id: "4573", item: "GI 11", grm: "5±0.2", detailGrm: "", dies: "Ø 12/14" },
  { comp: "E", id: "4573", item: "GI 12", grm: "35±0.5", detailGrm: "", dies: "TH 44" },
  { comp: "E", id: "4354", item: "ID 11", grm: "33", detailGrm: "(319)", dies: "Ø 35" },
  { comp: "E", id: "4354", item: "IC 13", grm: "135", detailGrm: "", dies: "276" },
  { comp: "E", id: "2305", item: "PK 275", grm: "16", detailGrm: "(309)", dies: "Ø 30 (AIR BERSIH)" },
  { comp: "E", id: "2305", item: "PK 276", grm: "70", detailGrm: "(103)", dies: "Ø 35" },
  { comp: "E", id: "2305", item: "CP 21", grm: "30", detailGrm: "", dies: "Ø 30" },
  { comp: "A", id: "2625", item: "KR 13", grm: "31", detailGrm: "", dies: "Ø 27" },
  { comp: "E", id: "1070", item: "NS 91", grm: "6.5", detailGrm: "", dies: "NS 91" },
  { comp: "E", id: "1637", item: "JOIN/TP 1", grm: "45", detailGrm: "", dies: "Ø 25" },
  { comp: "E", id: "1637", item: "JOIN/TP 2", grm: "35", detailGrm: "(144)", dies: "Ø 22" },
  { comp: "E", id: "4772", item: "IC 105", grm: "250", detailGrm: "", dies: "276" },
  { comp: "E", id: "4772", item: "IC 141", grm: "105", detailGrm: "", dies: "276" },
  { comp: "E", id: "2704", item: "EMI 01/02", grm: "23±0.5", detailGrm: "(317)", dies: "EMI 01/02" },
  { comp: "E", id: "2630", item: "PK 223", grm: "80", detailGrm: "", dies: "Ø 30" },
  { comp: "AG", id: "4615", item: "DF 114", grm: "190", detailGrm: "(72-153)", dies: "276" },
  { comp: "AG", id: "2703", item: "KK 21", grm: "300", detailGrm: "(94)", dies: "TH 44" },
  { comp: "B", id: "2615", item: "SI 02/03", grm: "45", detailGrm: "(329)", dies: "TH 44" },
  { comp: "E", id: "2601", item: "PJ 296", grm: "7-8", detailGrm: "(333)", dies: "Ø 16/17" },
  { comp: "E", id: "4751", item: "GI 008", grm: "32", detailGrm: "(340)", dies: "Y 316" },
  { comp: "E", id: "529", item: "KG 39", grm: "11", detailGrm: "(151)", dies: "KG 39" },

  // From Latest Batch Images: MS (IMG20260924083913_a28c1a1f.jpg)
  { comp: "E", id: "2728", item: "MS 31 A", grm: "60", detailGrm: "", dies: "TH 44" },
  { comp: "E", id: "2725", item: "MS 31 B", grm: "2.5", detailGrm: "", dies: "Ø 14" },
  { comp: "E", id: "4573", item: "MS 01", grm: "190", detailGrm: "(60)", dies: "276" },
  { comp: "E", id: "4573", item: "MS 45", grm: "4.5-136", detailGrm: "", dies: "Ø 14" },
  { comp: "E", id: "1000", item: "MS 44", grm: "30", detailGrm: "", dies: "TH 44" },
  { comp: "EG", id: "2804", item: "MS 47", grm: "1.7", detailGrm: "", dies: "Ø 14" },
  { comp: "AG", id: "4615", item: "MS 54", grm: "37", detailGrm: "", dies: "Ø 35" },

  // From New Uploaded Images: MF, NC, SH, MK
  { comp: "E", id: "4573", item: "MF 16", grm: "180", detailGrm: "(276)", dies: "276 / TH 44" },
  { comp: "S", id: "2522", item: "MF 20", grm: "60", detailGrm: "(276)", dies: "TH 44" },
  { comp: "S", id: "2522", item: "MF 21", grm: "70", detailGrm: "(238)", dies: "TH 44" },
  { comp: "S", id: "2522", item: "MF 22", grm: "75", detailGrm: "", dies: "TH 44" },
  { comp: "AG", id: "4615", item: "MF 14", grm: "43", detailGrm: "", dies: "Ø 30" },
  { comp: "AG", id: "4615", item: "MF 19", grm: "20", detailGrm: "(234)", dies: "Ø 20" },
  { comp: "As", id: "2814", item: "MF 25", grm: "8", detailGrm: "(152)", dies: "Ø 16-18" },

  { comp: "S", id: "2626", item: "NC 05", grm: "32", detailGrm: "(207)", dies: "Ø 38" },
  { comp: "S", id: "2626", item: "NC 06", grm: "30", detailGrm: "(58)", dies: "TR 2" },
  { comp: "S", id: "2626", item: "NC 07", grm: "43", detailGrm: "(75)", dies: "TR 2" },
  { comp: "S", id: "2626", item: "NC 08", grm: "37", detailGrm: "(169)", dies: "TR 2" },
  { comp: "S", id: "2626", item: "NC 09", grm: "56", detailGrm: "", dies: "" },

  { comp: "As", id: "2814", item: "SH 02", grm: "115", detailGrm: "(07)", dies: "276" },
  { comp: "SA", id: "2685", item: "SH 24 SP", grm: "115", detailGrm: "", dies: "276" },
  { comp: "AG", id: "2631", item: "SH 27", grm: "85-86", detailGrm: "", dies: "Ø 20/27" },
  { comp: "AG", id: "2631", item: "SH 28", grm: "80", detailGrm: "", dies: "Ø 28" },
  { comp: "AG", id: "2711", item: "SH 01", grm: "155", detailGrm: "", dies: "276" },
  { comp: "SA", id: "2685", item: "SH 24 CL", grm: "250", detailGrm: "(93)", dies: "276" },

  { comp: "AG", id: "2805", item: "MK 25", grm: "60±2", detailGrm: "(293)", dies: "Ø 45" },
  { comp: "AG", id: "2805", item: "MK 10", grm: "9.5", detailGrm: "(292)", dies: "Ø 19" },
  { comp: "AG", id: "2805", item: "MK 26", grm: "9.5", detailGrm: "(297)", dies: "Ø 19" },
  { comp: "AG", id: "2711", item: "MK 12", grm: "29", detailGrm: "(265)", dies: "Ø 22/23" },
  { comp: "AG", id: "2706", item: "MK 13", grm: "33", detailGrm: "(19/28)", dies: "Ø 26" },
  { comp: "As", id: "2480", item: "MK 05", grm: "34", detailGrm: "(64)", dies: "Ø 19" },

  // From New Uploaded Images: MC, KW, MD, VP/VPM, DZ, HJ/HJM
  { comp: "E", id: "4354", item: "MC 13", grm: "51", detailGrm: "(141)", dies: "MC 13" },
  { comp: "E", id: "4573", item: "MC 08", grm: "60", detailGrm: "(208)", dies: "TR 2" },
  { comp: "S", id: "2626", item: "MC 10", grm: "160", detailGrm: "(362)", dies: "276" },
  { comp: "S", id: "2626", item: "MC 11", grm: "145", detailGrm: "", dies: "276" },
  { comp: "As", id: "2714", item: "MC 12", grm: "4.5", detailGrm: "(187)", dies: "Ø 16/17" },
  { comp: "EG", id: "2804", item: "MC 14", grm: "12", detailGrm: "", dies: "Ø 17" },

  { comp: "N", id: "2801", item: "KW 08", grm: "115", detailGrm: "(124)", dies: "KW 08" },
  { comp: "N", id: "2801", item: "KW 66", grm: "94", detailGrm: "(285)", dies: "KW 66" },
  { comp: "S", id: "2645", item: "KW 09", grm: "208", detailGrm: "(230)", dies: "276" },
  { comp: "As", id: "2666", item: "KW 04", grm: "31", detailGrm: "(267)", dies: "KW 04" },

  { comp: "E", id: "4354", item: "MD 49", grm: "80", detailGrm: "(312)", dies: "TH 44" },
  { comp: "N", id: "2701", item: "MD 85", grm: "19", detailGrm: "", dies: "Ø 21" },
  { comp: "AG", id: "2711", item: "MD 09", grm: "59", detailGrm: "(371)", dies: "Ø 30" },
  { comp: "AG", id: "2755", item: "MD 86", grm: "55", detailGrm: "(95)", dies: "Ø 35" },
  { comp: "AG", id: "4615", item: "MD 10", grm: "45", detailGrm: "(318)", dies: "Ø 26" },
  { comp: "E", id: "4354", item: "MD 46", grm: "60", detailGrm: "(368)", dies: "TH 44" },

  { comp: "E", id: "2645", item: "VP 15", grm: "30", detailGrm: "(128)", dies: "TR 2" },
  { comp: "N", id: "4645", item: "VP 37", grm: "6-7", detailGrm: "(321)", dies: "SK 34" },
  { comp: "N", id: "4645", item: "VP 35", grm: "35", detailGrm: "(280)", dies: "TH 44" },
  { comp: "AG", id: "2515", item: "VP 68", grm: "150", detailGrm: "", dies: "TR 2" },
  { comp: "AG", id: "4615", item: "VP 19", grm: "30", detailGrm: "", dies: "276" },
  { comp: "AG", id: "2631", item: "VP 47", grm: "270", detailGrm: "", dies: "276" },
  { comp: "N", id: "1711", item: "VP 16", grm: "138", detailGrm: "(354)", dies: "Ø 45" },

  { comp: "AG", id: "4615", item: "DZ 211", grm: "285", detailGrm: "", dies: "276" },
  { comp: "AG", id: "4615", item: "DZ 212", grm: "250", detailGrm: "", dies: "276" },
  { comp: "AG", id: "2720", item: "DZ 39", grm: "30", detailGrm: "", dies: "Ø 26" },
  { comp: "As", id: "2714", item: "DZ 137", grm: "25", detailGrm: "", dies: "Ø 25" },
  { comp: "E", id: "2665", item: "DZ 63", grm: "160", detailGrm: "", dies: "" },
  { comp: "E", id: "2265", item: "DZ 135", grm: "216", detailGrm: "", dies: "" },
  { comp: "E", id: "1742", item: "DZ 177", grm: "55", detailGrm: "", dies: "Ø 65" },

  { comp: "E", id: "4573", item: "HJ 54", grm: "53", detailGrm: "(56)", dies: "TH 44 (Pendek)" },
  { comp: "E", id: "4573", item: "HJ 49", grm: "47", detailGrm: "(69)", dies: "Y 151 (-)" },
  { comp: "E", id: "4573", item: "HJ 55", grm: "90", detailGrm: "(294)", dies: "TH 44 (Pendek)" },
  { comp: "E", id: "4573", item: "HJ 32", grm: "90", detailGrm: "", dies: "" },

  // From New Uploaded Image: DT Page
  { comp: "E", id: "1742/1000", item: "DT 31", grm: "26", detailGrm: "(336)", dies: "Ø 45" },
  { comp: "E", id: "2657", item: "DT 58", grm: "36", detailGrm: "", dies: "Y 151 (AIR BERSIH)" },
  { comp: "E", id: "2645", item: "DT 109", grm: "195", detailGrm: "(03)", dies: "276 (BESAR)" },
  { comp: "E", id: "2645", item: "DT 61", grm: "150", detailGrm: "", dies: "276" },
  { comp: "E", id: "2653", item: "DT 167", grm: "275", detailGrm: "", dies: "276" },
  { comp: "E", id: "2653", item: "DT 122", grm: "48", detailGrm: "", dies: "DT 167" },
  { comp: "E", id: "2665", item: "DT 167", grm: "31", detailGrm: "", dies: "276" },
  { comp: "E", id: "2665", item: "DT 178", grm: "210", detailGrm: "(296)", dies: "276 (AIR BERSIH)" },
  { comp: "E", id: "2653", item: "DT 178", grm: "216", detailGrm: "", dies: "TH 44" },
  { comp: "E", id: "2514", item: "DT 40", grm: "130", detailGrm: "", dies: "276" },
  { comp: "E", id: "4354", item: "DT 81", grm: "60", detailGrm: "", dies: "Ø 10" },
  { comp: "E", id: "2665", item: "DT 139", grm: "3.5", detailGrm: "", dies: "Ø 10" },
  { comp: "E", id: "2658", item: "DT 113", grm: "2.5", detailGrm: "", dies: "Ø 26" },
  { comp: "E", id: "2539", item: "DT 97", grm: "2.5", detailGrm: "", dies: "Ø 10" },
  { comp: "E", id: "2539", item: "DT 99", grm: "2.2", detailGrm: "", dies: "SC 24" },
  { comp: "E", id: "2539", item: "DT 96", grm: "16", detailGrm: "", dies: "276" },
  { comp: "E", id: "2539", item: "DT 30", grm: "80", detailGrm: "", dies: "276" },
  { comp: "E", id: "1000", item: "DT 151/152", grm: "225", detailGrm: "", dies: "Ø 65" },
  { comp: "E", id: "1742", item: "DT 44", grm: "22", detailGrm: "", dies: "" },
  { comp: "E", id: "1742", item: "DT 27 A", grm: "18", detailGrm: "", dies: "" },
  { comp: "E", id: "1742", item: "DT 28", grm: "50", detailGrm: "(335)", dies: "276" },
  { comp: "E", id: "1742", item: "DT 160 A", grm: "115", detailGrm: "", dies: "276" },
  { comp: "E", id: "4772", item: "DT 98", grm: "195", detailGrm: "", dies: "" },
  { comp: "E", id: "1731", item: "DT 166 A", grm: "-", detailGrm: "", dies: "" },

  // From New Uploaded Image: ND Page
  { comp: "E", id: "4573", item: "ND 366", grm: "165", detailGrm: "(235)", dies: "276" },
  { comp: "E", id: "4573", item: "ND 361", grm: "70", detailGrm: "", dies: "Y 151" },
  { comp: "E", id: "4593", item: "ND 454", grm: "155", detailGrm: "", dies: "276" },
  { comp: "E", id: "4573", item: "ND 362", grm: "30.5", detailGrm: "", dies: "TH 44" },
  { comp: "E", id: "4573", item: "ND 309", grm: "26", detailGrm: "", dies: "TR 2" },
  { comp: "E", id: "4573", item: "ND 308", grm: "190", detailGrm: "", dies: "276" },
  { comp: "E", id: "4573", item: "ND 397", grm: "170", detailGrm: "", dies: "276" },
  { comp: "E", id: "4573", item: "ND 364", grm: "340", detailGrm: "(311)", dies: "TH 44" },
  { comp: "E", id: "4573", item: "ND 77", grm: "135", detailGrm: "(307)", dies: "Ø 14" },
  { comp: "E", id: "4573", item: "ND 275", grm: "35", detailGrm: "(320)", dies: "Ø 14" },
  { comp: "E", id: "4573", item: "ND 114", grm: "200", detailGrm: "(290)", dies: "TH 44" },
  { comp: "E", id: "4573", item: "ND 453", grm: "1.5", detailGrm: "", dies: "TH 44" },
  { comp: "E", id: "4573", item: "ND 49", grm: "28.5", detailGrm: "", dies: "TR 2" },
  { comp: "E", id: "4573", item: "ND 389", grm: "70", detailGrm: "(338)", dies: "276" },
  { comp: "E", id: "4401", item: "ND 349", grm: "50", detailGrm: "(277)", dies: "TR 2" },
  { comp: "E", id: "4354", item: "ND 331", grm: "155", detailGrm: "", dies: "276" },
  { comp: "E", id: "4354", item: "ND 325", grm: "8.5", detailGrm: "(222)", dies: "276" },
  { comp: "E", id: "4354", item: "ND 327", grm: "165", detailGrm: "", dies: "TR 2" },
  { comp: "E", id: "4354", item: "ND 292", grm: "6", detailGrm: "", dies: "TH 44" },
  { comp: "E", id: "4354", item: "ND 307", grm: "80", detailGrm: "", dies: "TR 2" },
  { comp: "E", id: "4354", item: "ND 338", grm: "5", detailGrm: "", dies: "DT 32" },
  { comp: "E", id: "4354", item: "ND 274", grm: "8.5", detailGrm: "", dies: "TP 2" }
];


export default function App() {
  const [dbData, setDbData] = useState<DataRow[]>(() => {
    try {
      const saved = localStorage.getItem('searchEngineDB');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const map = new Map<string, DataRow>();
          // First add saved items so user edits and deletions are fully preserved across refreshes
          parsed.forEach(item => {
            const key = (item.item || '').trim().toUpperCase();
            if (key) map.set(key, item);
          });
          // Then add any new DEFAULT_DATA items that aren't in saved storage yet
          DEFAULT_DATA.forEach(item => {
            const key = (item.item || '').trim().toUpperCase();
            if (key && !map.has(key)) {
              map.set(key, item);
            }
          });
          return Array.from(map.values());
        }
      }
    } catch (e) {
      console.error("Failed to load local storage", e);
    }
    return DEFAULT_DATA;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [itemPrefixFilter, setItemPrefixFilter] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [sortBy, setSortBy] = useState<keyof DataRow>('item');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState<DataRow>({
    comp: '',
    id: '',
    item: '',
    grm: '',
    detailGrm: '',
    dies: ''
  });

  // Images viewer modal state
  const [isImagesModalOpen, setIsImagesModalOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // File input ref for import
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem('searchEngineDB', JSON.stringify(dbData));
    } catch (e) {
      console.error("Failed to save to local storage", e);
    }
  }, [dbData]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Unique list of item prefixes/categories for filter
  const availableItemPrefixes = useMemo(() => {
    const set = new Set<string>();
    dbData.forEach(d => {
      const match = (d.item || '').trim().match(/^([A-Za-z]+)\s*/);
      if (match && match[1]) {
        set.add(match[1].toUpperCase());
      }
    });
    return Array.from(set).sort();
  }, [dbData]);

  // Filtered and sorted data
  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    const filtered = dbData.filter(item => {
      const matchesQuery = 
        (item.comp && item.comp.toLowerCase().includes(q)) ||
        (item.id && item.id.toLowerCase().includes(q)) ||
        (item.item && item.item.toLowerCase().includes(q)) ||
        (item.grm && item.grm.toLowerCase().includes(q)) ||
        (item.detailGrm && item.detailGrm.toLowerCase().includes(q)) ||
        (item.dies && item.dies.toLowerCase().includes(q));

      const matchesPrefix = itemPrefixFilter === '' || 
        (item.item && item.item.trim().toUpperCase().startsWith(itemPrefixFilter));
      return matchesQuery && matchesPrefix;
    });

    return filtered.sort((a, b) => {
      let valA = (a[sortBy] || '').toString().toLowerCase();
      let valB = (b[sortBy] || '').toString().toLowerCase();
      
      if (sortBy === 'id' || sortBy === 'grm') {
        const numA = parseFloat(valA);
        const numB = parseFloat(valB);
        if (!isNaN(numA) && !isNaN(numB)) {
          return sortOrder === 'asc' ? numA - numB : numB - numA;
        }
      }

      if (sortBy === 'item') {
        const parseItem = (str: string) => {
          const match = str.match(/^([A-Za-z]+)\s*(\d+)(.*)$/);
          if (match) {
            return [match[1], parseInt(match[2], 10), match[3]];
          }
          return [str, 0, ''];
        };
        const [prefixA, numA, suffixA] = parseItem(valA);
        const [prefixB, numB, suffixB] = parseItem(valB);

        if (prefixA === prefixB && typeof numA === 'number' && typeof numB === 'number' && numA !== numB) {
          return sortOrder === 'asc' ? numA - numB : numB - numA;
        }
      }

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [dbData, searchQuery, itemPrefixFilter, sortBy, sortOrder]);

  const handleSort = (field: keyof DataRow) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const openAddModal = () => {
    setEditingIndex(null);
    setFormData({ comp: '', id: '', item: '', grm: '', detailGrm: '', dies: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (originalIndex: number) => {
    setEditingIndex(originalIndex);
    setFormData({ ...dbData[originalIndex] });
    setIsModalOpen(true);
  };

  const handleSaveData = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.item || !formData.grm) {
      showToast('Harap isi kolom yang wajib (ID, ITEM, GRM)!');
      return;
    }

    if (editingIndex !== null) {
      const updated = [...dbData];
      updated[editingIndex] = formData;
      setDbData(updated);
      showToast('Data berhasil diperbarui!');
    } else {
      setDbData([formData, ...dbData]);
      showToast('Data baru berhasil ditambahkan!');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (originalIndex: number) => {
    if (window.confirm('Yakin ingin menghapus data ini dari database?')) {
      const updated = dbData.filter((_, idx) => idx !== originalIndex);
      setDbData(updated);
      showToast('Data berhasil dihapus.');
    }
  };

  const handleResetDefault = () => {
    if (window.confirm('Reset database kembali ke seluruh data catatan lengkap?')) {
      setDbData(DEFAULT_DATA);
      setSearchQuery('');
      setItemPrefixFilter('');
      showToast('Database direset ke data lengkap.');
    }
  };

  const handleExportCSV = () => {
    let csvStr = "COMP,ID,ITEM,GRM,Detail GRM,DIES\n";
    dbData.forEach(row => {
      csvStr += `"${row.comp}","${row.id}","${row.item}","${row.grm}","${row.detailGrm}","${row.dies}"\n`;
    });
    const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `database_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    showToast('Ekspor CSV berhasil!');
  };

  const handleExportJSON = () => {
    const blob = new Blob([JSON.stringify(dbData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `database_export_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Ekspor JSON berhasil!');
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            setDbData(parsed);
            showToast(`Berhasil mengimpor ${parsed.length} data dari JSON!`);
          } else {
            throw new Error('Format JSON harus berupa array');
          }
        } else if (file.name.endsWith('.csv')) {
          const lines = content.split('\n').filter(l => l.trim().length > 0);
          const newRows: DataRow[] = [];
          const startIndex = lines[0].toLowerCase().includes('comp') ? 1 : 0;
          for (let i = startIndex; i < lines.length; i++) {
            const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());
            if (cols.length >= 4) {
              newRows.push({
                comp: cols[0] || '',
                id: cols[1] || '',
                item: cols[2] || '',
                grm: cols[3] || '',
                detailGrm: cols[4] || '',
                dies: cols[5] || ''
              });
            }
          }
          if (newRows.length > 0) {
            setDbData(newRows);
            showToast(`Berhasil mengimpor ${newRows.length} data dari CSV!`);
          } else {
            showToast('Tidak ada data valid ditemukan dalam CSV.');
          }
        }
      } catch (err) {
        console.error(err);
        showToast('Gagal memproses file. Pastikan format benar.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Disalin ke clipboard: ${text}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-800 font-sans">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce border border-slate-700/50">
          <Sparkles className="w-5 h-5 text-blue-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Hidden File Input for Import */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImportFile} 
        accept=".json,.csv" 
        className="hidden" 
      />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 text-white p-2.5 rounded-xl shadow-md shadow-blue-500/20 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-lg tracking-tight">DataCentral</span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">Spek Barwell Komponen & Dies Industri</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">


            <button
              onClick={openAddModal}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition flex items-center gap-2 shadow-md shadow-blue-500/25 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Data</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-grow max-w-6xl w-full mx-auto px-4 py-8 flex flex-col">
        
        {/* Hero Title & Stats Banner */}
        <div className="text-center mb-8">

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Spek <span className="text-blue-600">Barwell</span>
          </h1>


          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 max-w-3xl mx-auto">
            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm text-left">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Data</span>
                <Layers className="w-4 h-4 text-blue-500" />
              </div>
              <div className="text-xl font-bold text-slate-800">{dbData.length}</div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm text-left">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Kategori Item</span>
                <Hash className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-xl font-bold text-slate-800">{availableItemPrefixes.length} Kategori</div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm text-left">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Terfilter</span>
                <Search className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-xl font-bold text-slate-800">{filteredData.length} Item</div>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-sm text-left">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider">Dies Tercatat</span>
                <Wrench className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-xl font-bold text-slate-800">
                {dbData.filter(d => d.dies && d.dies.trim() !== '').length}
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar Box */}
        <div className="w-full relative shadow-xl shadow-slate-200/50 rounded-2xl bg-white border border-slate-200/80 p-2.5 mb-5 transition-all focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500">
          <div className="flex items-center">
            <span className="pl-3.5 pr-2 text-blue-600 text-lg">
              <Search className="w-5 h-5" />
            </span>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik kata kunci (Contoh: TR 12, TB 76, MS 31 A, HF 36, PK 275, DT 62, ND 299)..." 
              className="w-full py-2.5 px-2 outline-none text-slate-800 text-base bg-transparent placeholder:text-slate-400 font-medium"
              autoFocus
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')} 
                className="pr-3 text-slate-400 hover:text-slate-600 transition"
                title="Bersihkan Pencarian"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>



        {/* Controls Bar: Filter Komponen Item & View Mode */}
        <div className="w-full flex flex-wrap items-center justify-between gap-4 text-xs text-slate-600 mb-6 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" /> Komponen Item:
              </span>
              <select 
                value={itemPrefixFilter}
                onChange={(e) => setItemPrefixFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 outline-none text-slate-700 font-medium focus:border-blue-500 transition"
              >
                <option value="">Semua Kategori ({dbData.length})</option>
                {availableItemPrefixes.map(p => (
                  <option key={p} value={p}>Item {p}</option>
                ))}
              </select>
            </div>

            {itemPrefixFilter && (
              <button
                onClick={() => setItemPrefixFilter('')}
                className="text-xs text-blue-600 hover:underline font-semibold"
              >
                Tampilkan Semua
              </button>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold text-slate-700">
              Hasil: <span className="text-blue-600">{filteredData.length}</span> dari {dbData.length} data
            </span>

            <div className="h-4 w-px bg-slate-200"></div>

            <div className="flex items-center bg-slate-100 p-1 rounded-xl">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                title="Tampilan Tabel"
              >
                <TableIcon className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition ${viewMode === 'grid' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                title="Tampilan Kartu Grid"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {filteredData.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Tidak Ada Data Ditemukan</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">
              Pencarian untuk "{searchQuery || itemPrefixFilter}" tidak menghasilkan kecocokan di database.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => { setSearchQuery(''); setItemPrefixFilter(''); }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold transition"
              >
                Reset Semua Filter
              </button>
              <button
                onClick={openAddModal}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-md shadow-blue-500/25 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> Tambah Data Ini
              </button>
            </div>
          </div>
        ) : viewMode === 'table' ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200/80 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <th className="p-4 cursor-pointer hover:text-blue-600 transition" onClick={() => handleSort('comp')}>
                      <div className="flex items-center gap-1.5">
                        <span>COMP</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="p-4 cursor-pointer hover:text-blue-600 transition" onClick={() => handleSort('id')}>
                      <div className="flex items-center gap-1.5">
                        <span>ID</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="p-4 cursor-pointer hover:text-blue-600 transition" onClick={() => handleSort('item')}>
                      <div className="flex items-center gap-1.5">
                        <span>ITEM</span>
                        <ArrowUpDown className="w-3 h-3 text-blue-600" />
                      </div>
                    </th>
                    <th className="p-4 cursor-pointer hover:text-blue-600 transition" onClick={() => handleSort('grm')}>
                      <div className="flex items-center gap-1.5">
                        <span>GRM</span>
                        <ArrowUpDown className="w-3 h-3" />
                      </div>
                    </th>
                    <th className="p-4">DETAIL GRM</th>
                    <th className="p-4">DIES / KET</th>
                    <th className="p-4 text-right">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {filteredData.map((row, idx) => {
                    const originalIndex = dbData.indexOf(row);
                    return (
                      <tr key={originalIndex} className="hover:bg-blue-50/40 transition group">
                        <td className="p-4 font-bold text-blue-600">
                          {row.comp ? (
                            <span className="bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60 inline-block">
                              {row.comp}
                            </span>
                          ) : <span className="text-slate-400 font-normal">-</span>}
                        </td>
                        <td className="p-4 font-mono font-medium text-slate-700">{row.id || '-'}</td>
                        <td className="p-4 font-semibold text-slate-900">
                          <span className="cursor-pointer hover:text-blue-600 flex items-center gap-1.5" onClick={() => copyToClipboard(row.item)} title="Klik untuk salin">
                            {row.item}
                            <Copy className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-slate-400 transition" />
                          </span>
                        </td>
                        <td className="p-4 font-medium text-slate-700">{row.grm}</td>
                        <td className="p-4 text-slate-500 font-medium">
                          {row.detailGrm ? (
                            <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded-md text-xs border border-amber-200/60 font-mono">
                              {row.detailGrm}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="p-4 text-slate-700">
                          {row.dies ? (
                            <span className="bg-slate-100 text-slate-800 px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 inline-flex items-center gap-1.5">
                              <Wrench className="w-3 h-3 text-slate-500 shrink-0" />
                              {row.dies}
                            </span>
                          ) : '-'}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditModal(originalIndex)}
                              className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition"
                              title="Edit Data"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(originalIndex)}
                              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                              title="Hapus Data"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredData.map((row) => {
              const originalIndex = dbData.indexOf(row);
              return (
                <div key={originalIndex} className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="bg-blue-50 text-blue-700 font-bold px-3 py-1 rounded-xl text-xs border border-blue-200/60">
                        COMP: {row.comp || '-'}
                      </span>
                      <span className="font-mono text-xs font-semibold text-slate-400">
                        ID: {row.id || '-'}
                      </span>
                    </div>

                    <div className="mb-4">
                      <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                        {row.item}
                        <button onClick={() => copyToClipboard(row.item)} className="text-slate-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition">
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </h3>
                      <div className="flex items-center gap-2 mt-2 text-xs text-slate-600">
                        <span className="bg-slate-100 px-2.5 py-1 rounded-lg font-medium">GRM: <strong>{row.grm}</strong></span>
                        {row.detailGrm && (
                          <span className="bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg font-mono font-medium border border-amber-200/60">
                            {row.detailGrm}
                          </span>
                        )}
                      </div>
                    </div>

                    {row.dies && (
                      <div className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl text-xs text-slate-700 flex items-center gap-2 mb-4">
                        <Wrench className="w-4 h-4 text-blue-600 shrink-0" />
                        <span className="font-medium truncate">Dies: {row.dies}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => openEditModal(originalIndex)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-600 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(originalIndex)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-red-50 text-slate-700 hover:text-red-600 rounded-xl text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Hapus
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white">
        <p className="font-medium">DataCentral &copy; 2026 - Spek Barwell Industri Terintegrasi</p>
      </footer>

      {/* Modal Foto Catatan Sumber (All 13 Images) */}
      {isImagesModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-6xl w-full p-6 shadow-2xl border border-slate-100 relative my-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-amber-600" />
                Catatan Fisik Sumber Master (TR, TB, MS, Dan Lain Lain, PJ, IC, DT, ND, YY, H, HO, MT, TH, SK, Y)
              </h3>
              <button
                onClick={() => setIsImagesModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Berikut adalah seluruh 13 foto catatan fisik master yang telah disinkronkan ke dalam sistem database:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[70vh] overflow-y-auto pr-2">
              <div className="border border-slate-200 rounded-2xl p-2 bg-slate-50">
                <p className="text-xs font-bold text-slate-700 mb-2 text-center">Catatan MS</p>
                <img src="/public/assets/aistudio/IMG20260924083913_a28c1a1f.jpg" alt="MS" className="w-full h-auto rounded-xl shadow-sm object-contain max-h-[350px]" />
              </div>
              <div className="border border-slate-200 rounded-2xl p-2 bg-slate-50">
                <p className="text-xs font-bold text-slate-700 mb-2 text-center">Catatan TR</p>
                <img src="/public/assets/aistudio/IMG20260924083924_01475f33.jpg" alt="TR" className="w-full h-auto rounded-xl shadow-sm object-contain max-h-[350px]" />
              </div>
              <div className="border border-slate-200 rounded-2xl p-2 bg-slate-50">
                <p className="text-xs font-bold text-slate-700 mb-2 text-center">Catatan TB</p>
                <img src="/public/assets/aistudio/IMG20260924083926_f76ea0e1.jpg" alt="TB" className="w-full h-auto rounded-xl shadow-sm object-contain max-h-[350px]" />
              </div>
              <div className="border border-slate-200 rounded-2xl p-2 bg-slate-50">
                <p className="text-xs font-bold text-slate-700 mb-2 text-center">Catatan Dan Lain Lain</p>
                <img src="/public/assets/aistudio/IMG20260924083935_cb2b7bdb.jpg" alt="Dan Lain Lain" className="w-full h-auto rounded-xl shadow-sm object-contain max-h-[350px]" />
              </div>
              <div className="border border-slate-200 rounded-2xl p-2 bg-slate-50">
                <p className="text-xs font-bold text-slate-700 mb-2 text-center">Catatan PJ & IC</p>
                <img src="/public/assets/aistudio/IMG20260924083939_151a434f.jpg" alt="PJ & IC" className="w-full h-auto rounded-xl shadow-sm object-contain max-h-[350px]" />
              </div>
              <div className="border border-slate-200 rounded-2xl p-2 bg-slate-50">
                <p className="text-xs font-bold text-slate-700 mb-2 text-center">Catatan DT</p>
                <img src="/public/assets/aistudio/IMG20260924083946_9979f794.jpg" alt="DT" className="w-full h-auto rounded-xl shadow-sm object-contain max-h-[350px]" />
              </div>
              <div className="border border-slate-200 rounded-2xl p-2 bg-slate-50">
                <p className="text-xs font-bold text-slate-700 mb-2 text-center">Catatan ND</p>
                <img src="/public/assets/aistudio/IMG20260924083955_e229a34a.jpg" alt="ND" className="w-full h-auto rounded-xl shadow-sm object-contain max-h-[350px]" />
              </div>
              <div className="border border-slate-200 rounded-2xl p-2 bg-slate-50">
                <p className="text-xs font-bold text-slate-700 mb-2 text-center">Catatan YY / Y</p>
                <img src="/public/assets/aistudio/IMG20260924084000_204bfc97.jpg" alt="YY / Y" className="w-full h-auto rounded-xl shadow-sm object-contain max-h-[350px]" />
              </div>
              <div className="border border-slate-200 rounded-2xl p-2 bg-slate-50">
                <p className="text-xs font-bold text-slate-700 mb-2 text-center">Catatan Y (Tambahan)</p>
                <img src="/public/assets/aistudio/IMG20260924084004_be9e3726.jpg" alt="Y" className="w-full h-auto rounded-xl shadow-sm object-contain max-h-[350px]" />
              </div>
              <div className="border border-slate-200 rounded-2xl p-2 bg-slate-50">
                <p className="text-xs font-bold text-slate-700 mb-2 text-center">Catatan TH</p>
                <img src="/public/assets/aistudio/IMG20260924084013_761b8d85.jpg" alt="TH" className="w-full h-auto rounded-xl shadow-sm object-contain max-h-[350px]" />
              </div>
              <div className="border border-slate-200 rounded-2xl p-2 bg-slate-50">
                <p className="text-xs font-bold text-slate-700 mb-2 text-center">Catatan SK</p>
                <img src="/public/assets/aistudio/IMG20260924084016_cdf47f9b.jpg" alt="SK" className="w-full h-auto rounded-xl shadow-sm object-contain max-h-[350px]" />
              </div>
              <div className="border border-slate-200 rounded-2xl p-2 bg-slate-50">
                <p className="text-xs font-bold text-slate-700 mb-2 text-center">Catatan MT</p>
                <img src="/public/assets/aistudio/IMG20260924084025_4609ca86.jpg" alt="MT" className="w-full h-auto rounded-xl shadow-sm object-contain max-h-[350px]" />
              </div>
              <div className="border border-slate-200 rounded-2xl p-2 bg-slate-50">
                <p className="text-xs font-bold text-slate-700 mb-2 text-center">Catatan H dan HO</p>
                <img src="/public/assets/aistudio/IMG20260924084028_f92bbbfe.jpg" alt="H & HO" className="w-full h-auto rounded-xl shadow-sm object-contain max-h-[350px]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900">
                {editingIndex !== null ? 'Edit Data Database' : 'Tambah Data Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveData} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">COMP</label>
                  <input 
                    type="text" 
                    value={formData.comp}
                    onChange={(e) => setFormData({ ...formData, comp: e.target.value.toUpperCase() })}
                    placeholder="Contoh: E, S, AG" 
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ID *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="Contoh: 4573" 
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">ITEM *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.item}
                    onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                    placeholder="Contoh: TR 12 / TB 76" 
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1">GRM *</label>
                  <input 
                    type="text" 
                    required 
                    value={formData.grm}
                    onChange={(e) => setFormData({ ...formData, grm: e.target.value })}
                    placeholder="Contoh: 50±5 / 40" 
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Detail GRM (Opsional)</label>
                <input 
                  type="text" 
                  value={formData.detailGrm}
                  onChange={(e) => setFormData({ ...formData, detailGrm: e.target.value })}
                  placeholder="Contoh: (326)" 
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">DIES / Keterangan (Opsional)</label>
                <input 
                  type="text" 
                  value={formData.dies}
                  onChange={(e) => setFormData({ ...formData, dies: e.target.value })}
                  placeholder="Contoh: TH 44 / Ø 19" 
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 text-xs font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md shadow-blue-500/25"
                >
                  Simpan Data
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
