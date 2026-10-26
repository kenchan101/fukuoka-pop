const ink = "#253740";
const cream = "#fff8e7";
const blush = "#ff9aae";

const face = (x, y, s = 1, mood = "happy") => {
  const happy = mood === "happy";
  const wink = mood === "wink";
  const open = mood === "open";
  return `
  <g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${ink}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round">
    ${open
      ? `<ellipse cx="-18" cy="-2" rx="5" ry="7" fill="${ink}" stroke="none"/><circle cx="-16.5" cy="-4.5" r="1.6" fill="#fff" stroke="none"/>
         <ellipse cx="18" cy="-2" rx="5" ry="7" fill="${ink}" stroke="none"/><circle cx="19.5" cy="-4.5" r="1.6" fill="#fff" stroke="none"/>`
      : happy
        ? `<path d="M-26 -1q8 -10 16 0"/><path d="M10 -1q8 -10 16 0"/>`
        : wink
          ? `<path d="M-26 -1q8 -10 16 0"/><circle cx="18" cy="-2" r="4.5" fill="${ink}" stroke="none"/>`
          : `<path d="M-26 -1q8 -10 16 0"/><path d="M10 -1q8 -10 16 0"/>`}
    <path d="M-8 11q8 8 16 0" stroke-width="5"/>
    <ellipse cx="-32" cy="11" rx="8" ry="4.5" fill="${blush}" stroke="none" opacity=".8"/>
    <ellipse cx="32" cy="11" rx="8" ry="4.5" fill="${blush}" stroke="none" opacity=".8"/>
  </g>`;
};

const sparkle = (x, y, s = 1, color = "#fff") => `
  <g transform="translate(${x} ${y}) scale(${s})" fill="${color}" stroke="${ink}" stroke-width="3.5" stroke-linejoin="round">
    <path d="M0 -11L3 -3 11 0 3 3 0 11 -3 3 -11 0 -3 -3Z"/>
  </g>`;

const cloud = (x, y, s = 1, opacity = 1) => `
  <g transform="translate(${x} ${y}) scale(${s})" opacity="${opacity}" class="cloud-drift">
    <g fill="#fffdf3" stroke="${ink}" stroke-width="5" stroke-linejoin="round">
      <ellipse cx="0" cy="0" rx="34" ry="22"/>
      <ellipse cx="-28" cy="10" rx="24" ry="16"/>
      <ellipse cx="30" cy="10" rx="27" ry="17"/>
      <rect x="-30" y="8" width="62" height="19" rx="9"/>
    </g>
  </g>`;

const steam = (x, y, s = 1, color = "#fffdf3") => `
  <g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" class="steam">
    <path d="M0 0c-12 -12 8 -18 -2 -32"/>
    <path d="M18 4c12 -12 -8 -20 2 -34"/>
    <path d="M36 0c-10 -12 8 -16 0 -28"/>
  </g>`;

const heart = (x, y, s = 1, color = "#ff7d88") => `
  <path transform="translate(${x} ${y}) scale(${s})" d="M0 10C-14 -2 -18 -12 -9 -17 -3 -20 0 -15 0 -12 0 -15 3 -20 9 -17 18 -12 14 -2 0 10Z" fill="${color}" stroke="${ink}" stroke-width="3.5"/>`;

const flower = (x, y, s = 1, petal = "#9ddcff", center = "#ffdd66") => `
  <g transform="translate(${x} ${y}) scale(${s})" fill="${petal}" stroke="${ink}" stroke-width="2.8">
    <circle cx="0" cy="-7" r="6"/><circle cx="7" cy="-2" r="6"/><circle cx="4" cy="6" r="6"/>
    <circle cx="-4" cy="6" r="6"/><circle cx="-7" cy="-2" r="6"/>
    <circle cx="0" cy="0" r="4" fill="${center}"/>
  </g>`;

const wrap = (id, label, bg, inner, viewBox = "0 0 400 300") => `
<svg class="art-svg" viewBox="${viewBox}" role="img" aria-label="${label}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <pattern id="dots-${id}" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="4" cy="4" r="2.2" fill="${ink}" opacity=".12"/>
    </pattern>
  </defs>
  <rect width="400" height="300" fill="${bg}"/>
  <rect width="400" height="300" fill="url(#dots-${id})"/>
  ${inner}
</svg>`;

const towerArt = () => {
  return wrap("tower", "卡通化福岡塔與海邊黃昏", "#ffeab3", `
    <defs>
      <linearGradient id="towerSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#a7e8ff"/><stop offset=".55" stop-color="#ffe9ae"/><stop offset="1" stop-color="#ffc59b"/>
      </linearGradient>
      <clipPath id="towerBody"><polygon points="200,36 168,214 232,214"/></clipPath>
    </defs>
    <rect width="400" height="300" fill="url(#towerSky)"/>
    <circle cx="316" cy="58" r="43" fill="#ffe477" stroke="${ink}" stroke-width="5"/>
    <g stroke="${ink}" stroke-width="5" stroke-linecap="round">
      <path d="M316 4v-2M366 58h12M316 112v8M264 58h-8"/>
      <path d="M352 22l8 -8M280 22l-8 -8M352 94l8 8M280 94l-8 8"/>
    </g>
    ${face(316, 62, 0.8, "happy")}
    ${cloud(70, 62, 0.95, 0.95)}
    ${cloud(270, 128, 0.62, 0.8)}
    <g fill="none" stroke="${ink}" stroke-width="3.5" stroke-linecap="round">
      <path d="M44 116q10 -7 20 0"/><path d="M74 104q8 -6 16 0"/><path d="M306 158q9 -6 18 0"/>
    </g>
    <path d="M0 188q40 -14 80 0t80 0 80 0 80 0 80 0v112H0Z" fill="#6fd2e8" stroke="${ink}" stroke-width="5"/>
    <g fill="none" stroke="#c9f6ff" stroke-width="5" stroke-linecap="round">
      <path d="M25 220q22 -10 44 0"/><path d="M312 236q20 -9 40 0"/><path d="M52 260q18 -8 36 0"/>
    </g>
    <path d="M0 254q46 -20 92 -4t92 0 92 -6 92 10 32 0v46H0Z" fill="#9fda7c" stroke="${ink}" stroke-width="5"/>
    <g>
      <path d="M188 36h24M200 36V16" fill="none" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>
      <circle cx="200" cy="15" r="6" fill="#ff6b5a" stroke="${ink}" stroke-width="4"/>
      <polygon points="200,39 166,216 234,216" fill="#fffdf6" stroke="${ink}" stroke-width="6" stroke-linejoin="round"/>
      <g clip-path="url(#towerBody)">
        <rect x="160" y="70" width="80" height="13" fill="#ff815f"/>
        <rect x="160" y="103" width="80" height="10" fill="#ffb35c"/>
        <rect x="160" y="139" width="80" height="12" fill="#ff815f"/>
        <rect x="160" y="178" width="80" height="9" fill="#ffb35c"/>
        <g stroke="#ffb9a3" stroke-width="3" opacity=".8">
          <path d="M188 39L180 216M212 39l10 177"/>
        </g>
      </g>
      <polygon points="160,88 240,88 246,126 154,126" fill="#ff7059" stroke="${ink}" stroke-width="6" stroke-linejoin="round"/>
      <rect x="164" y="97" width="14" height="19" rx="3" fill="#bff4ff" stroke="${ink}" stroke-width="3"/>
      <rect x="184" y="97" width="14" height="19" rx="3" fill="#bff4ff" stroke="${ink}" stroke-width="3"/>
      <rect x="204" y="97" width="14" height="19" rx="3" fill="#bff4ff" stroke="${ink}" stroke-width="3"/>
      <rect x="224" y="97" width="12" height="19" rx="3" fill="#bff4ff" stroke="${ink}" stroke-width="3"/>
      ${face(200, 112, 0.44, "happy")}
      ${face(200, 168, 0.34, "open")}
      <rect x="169" y="202" width="62" height="26" rx="6" fill="#fff2d2" stroke="${ink}" stroke-width="5"/>
      <rect x="189" y="210" width="22" height="18" rx="3" fill="#78d8c4" stroke="${ink}" stroke-width="3.5"/>
      <polygon points="200,39 214,214 200,214" fill="#fff" opacity=".22"/>
    </g>
    <g transform="translate(326 194)">
      <path d="M0 0c-4 20 -12 39 -21 54" fill="none" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>
      <g fill="#419f73" stroke="${ink}" stroke-width="4">
        <path d="M0 -4C-30 -20 -47 -4 -25 7 -9 14 -2 8 0 -4Z"/>
        <path d="M0 -4C30 -22 49 -6 26 7 10 15 2 8 0 -4Z"/>
        <path d="M-11 6C-34 12 -38 28 -14 30 1 31 2 18 -2 8Z"/>
      </g>
    </g>
    <g transform="translate(62 178)">
      <rect x="-13" y="0" width="26" height="54" rx="6" fill="#ff8f6b" stroke="${ink}" stroke-width="4"/>
      <rect x="-18" y="-8" width="36" height="12" rx="4" fill="#fff3d3" stroke="${ink}" stroke-width="4"/>
      ${face(0, 28, 0.34, "happy")}
    </g>
  `);
};

const ohoriArt = () => {
  return wrap("ohori", "卡通化大濠公園天鵝船", "#dff8ef", `
    <defs>
      <linearGradient id="ohoriSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#c9f3ff"/><stop offset="1" stop-color="#f4ffe7"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#ohoriSky)"/>
    <circle cx="326" cy="52" r="32" fill="#ffe47a" stroke="${ink}" stroke-width="5"/>
    ${face(326, 56, 0.58, "happy")}
    ${cloud(74, 56, 0.82, 1)}
    ${cloud(246, 92, 0.5, 0.7)}
    <g opacity=".55" fill="#8ed4dc" stroke="${ink}" stroke-width="3">
      <rect x="18" y="105" width="22" height="55" rx="3"/><rect x="46" y="86" width="28" height="74" rx="3"/>
      <rect x="80" y="116" width="18" height="44" rx="3"/><rect x="304" y="114" width="20" height="46" rx="3"/>
      <rect x="330" y="96" width="24" height="64" rx="3"/><rect x="360" y="122" width="18" height="38" rx="3"/>
    </g>
    <g>
      <path d="M0 164q60 -14 120 -2t120 0 160 -4v142H0Z" fill="#8bdcc9" stroke="${ink}" stroke-width="5"/>
      <path d="M0 184q80 -10 160 0t240 -4" fill="none" stroke="#c7fff0" stroke-width="5" stroke-linecap="round"/>
      <g fill="none" stroke="#e9fff8" stroke-width="4" stroke-linecap="round" opacity=".9">
        <path d="M34 222q22 -9 44 0"/><path d="M318 254q20 -8 40 0"/><path d="M186 276q22 -8 44 0"/>
      </g>
    </g>
    <g>
      <path d="M-10 158q40 -40 92 -10 34 20 14 42" fill="#88ce77" stroke="${ink}" stroke-width="5"/>
      <g fill="#55ad74" stroke="${ink}" stroke-width="5">
        <circle cx="24" cy="102" r="34"/><circle cx="63" cy="120" r="29"/><circle cx="5" cy="132" r="26"/>
      </g>
      <rect x="31" y="132" width="16" height="34" rx="6" fill="#8c6144" stroke="${ink}" stroke-width="4"/>
      <path d="M-12 232q52 -30 104 0" fill="#79c36c" stroke="${ink}" stroke-width="5"/>
      <g fill="#55ad74" stroke="${ink}" stroke-width="4">
        <circle cx="300" cy="136" r="28"/><circle cx="338" cy="152" r="22"/><circle cx="374" cy="140" r="24"/>
      </g>
      <rect x="330" y="160" width="13" height="34" rx="5" fill="#8c6144" stroke="${ink}" stroke-width="4"/>
    </g>
    <g>
      <path d="M46 172q154 -58 308 0" fill="none" stroke="#fff6d8" stroke-width="20" stroke-linecap="round"/>
      <path d="M46 172q154 -58 308 0" fill="none" stroke="${ink}" stroke-width="29" stroke-linecap="round" opacity=".18"/>
      <path d="M46 172q154 -58 308 0" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 16"/>
      <g stroke="${ink}" stroke-width="4">
        <path d="M100 150v-22M148 137v-22M204 132v-22M258 137v-22M308 150v-22" stroke="#ff7f6a" stroke-width="5"/>
        <path d="M96 130h54M144 117h60M200 112h60M254 117h58" stroke="#ff7f6a" stroke-width="5"/>
      </g>
    </g>
    <g transform="translate(248 206)" class="float-slow">
      <ellipse cx="0" cy="21" rx="55" ry="20" fill="#fffdf3" stroke="${ink}" stroke-width="5"/>
      <path d="M-18 0q-8 -45 20 -53 27 -8 34 17 4 18 -10 20" fill="#fffdf3" stroke="${ink}" stroke-width="5" stroke-linejoin="round"/>
      <path d="M27 -35l25 -10-4 23" fill="#ffb84f" stroke="${ink}" stroke-width="4" stroke-linejoin="round"/>
      ${face(0, 8, 0.58, "happy")}
      <path d="M-21 34q20 9 40 0" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>
    </g>
    <g transform="translate(104 244)">
      <ellipse cx="0" cy="0" rx="27" ry="15" fill="#ffe89a" stroke="${ink}" stroke-width="4"/>
      <circle cx="22" cy="-13" r="11" fill="#ffe89a" stroke="${ink}" stroke-width="4"/>
      <path d="M31 -14h12l-4 7h-8" fill="#ff9e54" stroke="${ink}" stroke-width="3.5"/>
      <circle cx="25" cy="-16" r="2.3" fill="${ink}"/>
    </g>
    <g transform="translate(70 282)" stroke="${ink}" stroke-width="3">
      ${flower(0, 0, 0.62, "#ff9db5")}${flower(28, 4, 0.45, "#fff")}${flower(318, -3, 0.55, "#ffd15c")}
    </g>
  `);
};

const dazaifuArt = () => {
  return wrap("dazaifu", "卡通化太宰府天滿宮與御神牛", "#ffe4eb", `
    <defs>
      <linearGradient id="dazSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffd4e2"/><stop offset="1" stop-color="#fff5d8"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#dazSky)"/>
    <circle cx="66" cy="58" r="34" fill="#ff9db5" stroke="${ink}" stroke-width="5"/>
    ${face(66, 61, 0.55, "wink")}
    ${cloud(286, 54, 0.76, 0.9)}
    <g stroke="${ink}" stroke-width="7" stroke-linecap="round" fill="none">
      <path d="M-10 116q60 -44 118 -14 30 13 38 44" stroke="#7d4b39"/>
      <path d="M48 88q-6 22 -24 32M106 94q12 18 8 38" stroke="#7d4b39" stroke-width="5"/>
    </g>
    <g>
      <g fill="#ffb3c7" stroke="${ink}" stroke-width="3">
        ${[0,1,2,3,4].map((i)=>`<g transform="translate(${18 + i*27} ${92 - (i%2)*14}) rotate(${i*23})"><circle cx="-8" cy="0" r="7"/><circle cx="8" cy="0" r="7"/><circle cx="0" cy="-8" r="7"/><circle cx="0" cy="8" r="7"/><circle cx="0" cy="0" r="4" fill="#ff6f91"/></g>`).join("")}
      </g>
    </g>
    <path d="M0 236q80 -18 160 0t240 -4v68H0Z" fill="#a8d983" stroke="${ink}" stroke-width="5"/>
    <g>
      <rect x="72" y="158" width="13" height="82" rx="4" fill="#eb594f" stroke="${ink}" stroke-width="5"/>
      <rect x="154" y="158" width="13" height="82" rx="4" fill="#eb594f" stroke="${ink}" stroke-width="5"/>
      <path d="M52 160q65 -13 136 0" fill="none" stroke="#eb594f" stroke-width="15" stroke-linecap="round"/>
      <path d="M52 160q65 -13 136 0" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round" opacity=".35"/>
      <rect x="64" y="176" width="112" height="12" rx="5" fill="#eb594f" stroke="${ink}" stroke-width="4"/>
      <rect x="88" y="145" width="64" height="12" rx="4" fill="#d94b43" stroke="${ink}" stroke-width="4"/>
    </g>
    <g transform="translate(254 138)">
      <rect x="-70" y="35" width="140" height="70" rx="6" fill="#fff1dc" stroke="${ink}" stroke-width="5"/>
      <rect x="-58" y="49" width="116" height="42" rx="3" fill="#f06e5d" stroke="${ink}" stroke-width="4"/>
      <g fill="#ffe4a3" stroke="${ink}" stroke-width="3">
        <rect x="-46" y="59" width="18" height="22" rx="2"/><rect x="-18" y="59" width="18" height="22" rx="2"/>
        <rect x="10" y="59" width="18" height="22" rx="2"/><rect x="38" y="59" width="12" height="22" rx="2"/>
      </g>
      <path d="M-100 38q100 -58 200 0l-16 13q-84 -42 -168 0Z" fill="#3e8078" stroke="${ink}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M-100 38q100 -58 200 0" fill="none" stroke="#ffe177" stroke-width="7" stroke-linecap="round"/>
      <circle cx="0" cy="-32" r="9" fill="#ffe177" stroke="${ink}" stroke-width="4"/>
      <path d="M-24 8h48" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>
      ${face(0, 8, 0.5, "happy")}
      <rect x="-38" y="105" width="76" height="8" fill="#d6b68b" stroke="${ink}" stroke-width="3"/>
    </g>
    <g transform="translate(312 216)">
      <ellipse cx="0" cy="22" rx="45" ry="12" fill="#89c879" stroke="${ink}" stroke-width="4"/>
      <path d="M-31 4q-4 -26 18 -28 26 -1 30 26l-5 21h-38Z" fill="#e9e4d5" stroke="${ink}" stroke-width="5"/>
      <path d="M-29 -13q-13 -11 -18 2 8 7 18 5M28 -13q13 -11 18 2-8 7-18 5" fill="#fff8e7" stroke="${ink}" stroke-width="4"/>
      <circle cx="-18" cy="1" r="3.5" fill="${ink}"/><circle cx="18" cy="1" r="3.5" fill="${ink}"/>
      <ellipse cx="0" cy="11" rx="10" ry="6" fill="#ffb0bc" stroke="${ink}" stroke-width="3"/>
      <circle cx="-5" cy="10" r="1.5" fill="${ink}"/><circle cx="5" cy="10" r="1.5" fill="${ink}"/>
      <path d="M-9 -28q9 -9 18 0" fill="none" stroke="${ink}" stroke-width="4"/>
    </g>
    <g transform="translate(200 236)">
      <rect x="-34" y="-26" width="68" height="44" rx="4" fill="#ffe5ae" stroke="${ink}" stroke-width="4" transform="rotate(-5)"/>
      <path d="M-10 -26v-8M10 -26v-8" stroke="${ink}" stroke-width="4"/>
      <path d="M-18 0h36M-13 8h26" stroke="#e58c62" stroke-width="4" stroke-linecap="round"/>
      <path d="M0 -14l4 9 10 1-7 7 2 10-9-5-9 5 2-10-7-7 10-1Z" fill="#ff8a9e" stroke="${ink}" stroke-width="2.5"/>
    </g>
    <g stroke="${ink}" stroke-width="3">
      ${flower(38, 260, 0.62, "#ff9db5")}${flower(356, 272, 0.5, "#fff")}${flower(132, 284, 0.4, "#ffd15c")}
    </g>
    <g fill="#ff9db5" stroke="${ink}" stroke-width="2" opacity=".9">
      <path d="M120 44q10 -12 20 0-10 12 -20 0Z"/><path d="M342 96q8 -10 16 0-8 10 -16 0Z"/>
    </g>
  `);
};

const kushidaArt = () => {
  return wrap("kushida", "卡通化櫛田神社與博多山笠", "#253b57", `
    <defs>
      <linearGradient id="kushiSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#193452"/><stop offset=".7" stop-color="#335b6b"/><stop offset="1" stop-color="#f28a66"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#kushiSky)"/>
    <circle cx="322" cy="52" r="28" fill="#ffe9a6" stroke="${ink}" stroke-width="4"/>
    <g fill="#fff6c7">
      <circle cx="42" cy="32" r="3"/><circle cx="90" cy="58" r="2.3"/><circle cx="150" cy="26" r="2.8"/>
      <circle cx="230" cy="48" r="2.2"/><circle cx="278" cy="24" r="3"/><circle cx="372" cy="96" r="2.4"/>
      <circle cx="56" cy="102" r="2"/><circle cx="190" cy="82" r="2.5"/>
    </g>
    ${cloud(80, 82, 0.55, 0.2)}
    <g opacity=".35" fill="#fff1cc" stroke="${ink}" stroke-width="3">
      <rect x="8" y="126" width="70" height="70" rx="4"/><rect x="322" y="132" width="68" height="64" rx="4"/>
    </g>
    <g>
      <rect x="14" y="170" width="14" height="86" rx="4" fill="#e14f47" stroke="${ink}" stroke-width="5"/>
      <rect x="94" y="170" width="14" height="86" rx="4" fill="#e14f47" stroke="${ink}" stroke-width="5"/>
      <path d="M-2 172q60 -15 122 0" fill="none" stroke="#e14f47" stroke-width="15" stroke-linecap="round"/>
      <path d="M-2 172q60 -15 122 0" fill="none" stroke="${ink}" stroke-width="3" opacity=".4"/>
      <rect x="8" y="186" width="106" height="11" rx="4" fill="#e14f47" stroke="${ink}" stroke-width="4"/>
    </g>
    <g transform="translate(198 102)">
      <path d="M-55 90L-44 8H44L55 90Z" fill="#f4dfbd" stroke="${ink}" stroke-width="5"/>
      <rect x="-50" y="27" width="100" height="60" rx="4" fill="#ca4d44" stroke="${ink}" stroke-width="5"/>
      <g fill="#ffe7b0" stroke="${ink}" stroke-width="3">
        <rect x="-38" y="39" width="20" height="40" rx="2"/><rect x="-12" y="39" width="20" height="40" rx="2"/>
        <rect x="14" y="39" width="20" height="40" rx="2"/>
      </g>
      <path d="M-70 12q70 -34 140 0l-9 16q-61 -24 -122 0Z" fill="#e26050" stroke="${ink}" stroke-width="5"/>
      <path d="M-58 -6q58 -40 116 0l-8 13q-50 -30 -100 0Z" fill="#ffd46f" stroke="${ink}" stroke-width="5"/>
      <g transform="translate(0 -26)">
        <path d="M-38 0q0 -29 38 -29 38 0 38 29 0 25 -38 25-38 0 -38 -25Z" fill="#f6e5bd" stroke="${ink}" stroke-width="5"/>
        <path d="M-38 0h76" stroke="${ink}" stroke-width="3" opacity=".3"/>
        ${face(0, -2, 0.72, "open")}
        <path d="M-28 -23q-7 -13 3 -19M28 -23q7 -13 -3 -19" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>
      </g>
      <g stroke="${ink}" stroke-width="5">
        <line x1="-55" y1="90" x2="-70" y2="112"/><line x1="55" y1="90" x2="70" y2="112"/>
      </g>
    </g>
    <g>
      <path d="M0 224q100 -18 200 0t200 -6v82H0Z" fill="#547b68" stroke="${ink}" stroke-width="5"/>
      <path d="M0 252q100 -10 200 0t200 0v48H0Z" fill="#3f6557" stroke="${ink}" stroke-width="4"/>
    </g>
    <g>
      <g transform="translate(44 208)">
        <rect x="-20" y="-1" width="40" height="46" rx="10" fill="#ffcf63" stroke="${ink}" stroke-width="4"/>
        <path d="M-20 6h40M-20 34h40" stroke="${ink}" stroke-width="3"/>
        ${face(0, 20, 0.34, "happy")}
      </g>
      <g transform="translate(320 214)">
        <rect x="-20" y="-1" width="40" height="46" rx="10" fill="#ffcf63" stroke="${ink}" stroke-width="4"/>
        <path d="M-20 6h40M-20 34h40" stroke="${ink}" stroke-width="3"/>
        ${face(0, 20, 0.34, "wink")}
      </g>
      <path d="M18 166q86 -18 176 0M290 170q60 -10 96 0" fill="none" stroke="${ink}" stroke-width="4"/>
    </g>
    <g fill="#ff8b7b" stroke="${ink}" stroke-width="2">
      <rect x="102" y="62" width="9" height="5" transform="rotate(24 102 62)"/>
      <rect x="280" y="128" width="9" height="5" transform="rotate(-28 280 128)"/>
      <rect x="240" y="42" width="8" height="4" transform="rotate(18 240 42)"/>
    </g>
    ${sparkle(136, 120, 0.6, "#ffe17c")}
    ${sparkle(292, 76, 0.45, "#fff1b8")}
  `);
};

const uminakaArt = () => {
  const flowers = [];
  const petals = ["#9ddcff", "#b8e6ff", "#84c8ff", "#c8c5ff"];
  for (let i = 0; i < 34; i++) {
    const x = 10 + ((i * 37) % 380);
    const y = 230 + ((i * 23) % 64);
    flowers.push(flower(x, y, 0.48 + (i % 4) * 0.05, petals[i % 4]));
  }
  return wrap("uminaka", "卡通化海之中道花海與摩天輪", "#dff4ff", `
    <defs>
      <linearGradient id="umiSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#91ddff"/><stop offset=".7" stop-color="#e4f9ff"/><stop offset="1" stop-color="#fff4c9"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#umiSky)"/>
    <circle cx="330" cy="55" r="36" fill="#ffe173" stroke="${ink}" stroke-width="5"/>
    ${face(330, 58, 0.6, "happy")}
    ${cloud(80, 48, 0.9, 1)}
    ${cloud(238, 92, 0.55, 0.8)}
    <path d="M0 162q60 -10 120 0t130 0 150 -4v142H0Z" fill="#77d4e7" stroke="${ink}" stroke-width="5"/>
    <g fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8">
      <path d="M24 196q20 -8 40 0"/><path d="M300 204q20 -8 40 0"/>
    </g>
    <g transform="translate(108 146)">
      <circle cx="0" cy="0" r="65" fill="#fff7df" stroke="${ink}" stroke-width="6"/>
      <g class="spin-slow" style="transform-origin:0px 0px">
        <g stroke="${ink}" stroke-width="4">
          <path d="M0 -58V58M-58 0H58M-41 -41L41 41M41 -41L-41 41"/>
        </g>
        <g stroke="${ink}" stroke-width="4">
          <circle cx="0" cy="-58" r="10" fill="#ff8f7c"/><circle cx="41" cy="-41" r="10" fill="#ffd15c"/>
          <circle cx="58" cy="0" r="10" fill="#8cdb9d"/><circle cx="41" cy="41" r="10" fill="#a8c7ff"/>
          <circle cx="0" cy="58" r="10" fill="#ff9db5"/><circle cx="-41" cy="41" r="10" fill="#ff8f7c"/>
          <circle cx="-58" cy="0" r="10" fill="#ffd15c"/><circle cx="-41" cy="-41" r="10" fill="#8cdb9d"/>
        </g>
      </g>
      <circle cx="0" cy="0" r="17" fill="#ffd15c" stroke="${ink}" stroke-width="4"/>
      ${face(0, 0, 0.34, "happy")}
      <path d="M-30 66L-42 98M30 66L42 98M0 67V102" stroke="${ink}" stroke-width="8" stroke-linecap="round"/>
      <path d="M-58 101h116" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>
    </g>
    <g transform="translate(292 176)">
      <rect x="-62" y="-28" width="115" height="48" rx="14" fill="#ffd15c" stroke="${ink}" stroke-width="5"/>
      <path d="M-62 -6h114" stroke="${ink}" stroke-width="3"/>
      <g fill="#a9ecff" stroke="${ink}" stroke-width="3">
        <rect x="-49" y="-19" width="20" height="16" rx="3"/><rect x="-22" y="-19" width="20" height="16" rx="3"/>
        <rect x="5" y="-19" width="20" height="16" rx="3"/><rect x="32" y="-19" width="14" height="16" rx="3"/>
      </g>
      ${face(18, 11, 0.4, "wink")}
      <circle cx="-55" cy="24" r="12" fill="#4e6d7a" stroke="${ink}" stroke-width="4"/>
      <circle cx="39" cy="24" r="12" fill="#4e6d7a" stroke="${ink}" stroke-width="4"/>
      <path d="M60 -12q28 10 26 38" fill="none" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>
    </g>
    <path d="M0 236q70 -18 140 -2t140 -2 120 0v68H0Z" fill="#8ed17e" stroke="${ink}" stroke-width="5"/>
    ${flowers.join("")}
    <g transform="translate(70 232)">
      <path d="M0 0q-8 -25 8 -38 17 -14 26 4 7 15 -3 22" fill="none" stroke="#377e5f" stroke-width="5"/>
      <g fill="#ff9db5" stroke="${ink}" stroke-width="3">
        <circle cx="33" cy="-31" r="9"/><circle cx="44" cy="-22" r="8"/><circle cx="31" cy="-14" r="8"/>
        <circle cx="24" cy="-23" r="7"/>
      </g>
    </g>
    <g transform="translate(350 226)" fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round">
      <path d="M0 0q10 -7 20 0"/><path d="M38 12q8 -6 16 0"/>
    </g>
  `);
};

const itoshimaArt = () => {
  return wrap("itoshima", "卡通化糸島夫婦岩日落", "#ffe0cb", `
    <defs>
      <linearGradient id="itoSky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffb3a0"/><stop offset=".52" stop-color="#ffd9a0"/><stop offset="1" stop-color="#fff0c8"/>
      </linearGradient>
      <linearGradient id="itoSea" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#ffc48f"/><stop offset="1" stop-color="#75c8dc"/>
      </linearGradient>
    </defs>
    <rect width="400" height="300" fill="url(#itoSky)"/>
    <circle cx="200" cy="122" r="55" fill="#ffdd6f" stroke="${ink}" stroke-width="5"/>
    ${face(200, 128, 0.8, "happy")}
    <g opacity=".3" fill="#fff3c7">
      <ellipse cx="80" cy="92" rx="50" ry="12"/><ellipse cx="322" cy="70" rx="42" ry="10"/>
    </g>
    <path d="M0 170q50 -14 100 0t100 0 100 0 100 0v130H0Z" fill="url(#itoSea)" stroke="${ink}" stroke-width="5"/>
    <g fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8">
      <path d="M20 212q24 -10 48 0"/><path d="M296 220q24 -10 48 0"/><path d="M150 262q24 -10 48 0"/>
    </g>
    <path d="M0 248q44 -24 88 -4t88 0 88 -2 88 12 48 2v44H0Z" fill="#f3d7a0" stroke="${ink}" stroke-width="4"/>
    <g>
      <path d="M117 200l16 -73 26 -22 22 30 -5 75Z" fill="#8b6d63" stroke="${ink}" stroke-width="5"/>
      <path d="M276 200l-8 -60 18 -34 30 18 4 82Z" fill="#7a625e" stroke="${ink}" stroke-width="5"/>
      <path d="M150 120q57 26 111 10" fill="none" stroke="#f5e6b8" stroke-width="10" stroke-linecap="round"/>
      <path d="M150 120q57 26 111 10" fill="none" stroke="${ink}" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>
      <g>
        ${face(150, 158, 0.55, "wink")}${face(286, 152, 0.55, "happy")}
      </g>
      <path d="M130 200q18 8 36 0M274 200q14 7 28 0" fill="none" stroke="#5ad0c4" stroke-width="7" stroke-linecap="round"/>
    </g>
    <g transform="translate(100 130)">
      <path d="M-28 18h56M-20 18V-8M20 18V-8M-32 -8h64M-22 -20h44" fill="none" stroke="#d95143" stroke-width="8" stroke-linecap="round"/>
    </g>
    <g transform="translate(70 258) rotate(-6)">
      <rect x="-42" y="-28" width="84" height="52" rx="8" fill="#f7f0df" stroke="${ink}" stroke-width="5"/>
      <circle cx="0" cy="-2" r="17" fill="#7fd4e7" stroke="${ink}" stroke-width="4"/>
      <circle cx="0" cy="-2" r="8" fill="#4a6d81" stroke="${ink}" stroke-width="3"/>
      <rect x="-34" y="-20" width="12" height="8" rx="2" fill="#ff8f7c" stroke="${ink}" stroke-width="2"/>
      ${face(0, 13, 0.28, "happy")}
      <path d="M-18 24v17M18 24v17" stroke="${ink}" stroke-width="4"/>
    </g>
    <g transform="translate(340 260)">
      <path d="M0 0v-24" stroke="${ink}" stroke-width="4"/>
      <path d="M-17 -24h34l-5 -24h-24Z" fill="#fff3d4" stroke="${ink}" stroke-width="4"/>
      <path d="M-9 -36h18" stroke="#d9835b" stroke-width="4"/>
      <path d="M-16 18q16 -8 32 0" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
    </g>
    <g fill="none" stroke="${ink}" stroke-width="3" stroke-linecap="round">
      <path d="M54 40q10 -7 20 0"/><path d="M92 30q8 -6 16 0"/><path d="M320 42q9 -6 18 0"/>
    </g>
  `);
};

const ramenArt = () => wrap("ramen", "卡通化博多拉麵", "#ffe5a8", `
  <defs>
    <linearGradient id="ramenBg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#ffd96f"/><stop offset="1" stop-color="#ffb18a"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#ramenBg)"/>
  <g fill="#fff6dd" opacity=".5">
    <circle cx="42" cy="48" r="18"/><circle cx="352" cy="70" r="26"/><circle cx="320" cy="252" r="14"/>
  </g>
  ${sparkle(62, 82, 0.7, "#fff")}
  ${sparkle(342, 118, 0.55, "#fff")}
  ${steam(160, 68, 1.05, "#fffdf3")}
  <g transform="translate(200 176)">
    <ellipse cx="0" cy="48" rx="125" ry="23" fill="#e07856" opacity=".35"/>
    <path d="M-128 -4q0 84 58 83h140q58 0 58 -83Z" fill="#f36b56" stroke="${ink}" stroke-width="6"/>
    <ellipse cx="0" cy="-4" rx="128" ry="35" fill="#fff5dc" stroke="${ink}" stroke-width="6"/>
    <ellipse cx="0" cy="-1" rx="113" ry="26" fill="#f6b44e" stroke="${ink}" stroke-width="4"/>
    <g fill="#ffe07a" stroke="${ink}" stroke-width="3">
      <path d="M-85 -9q20 -17 38 0 20 -16 38 2 18 -17 36 1 17 -14 34 2" fill="none" stroke-width="8" stroke-linecap="round"/>
      <path d="M-82 3q18 12 36 0 18 12 36 0 18 10 36 0" fill="none" stroke-width="7" stroke-linecap="round"/>
    </g>
    <g transform="translate(-64 -10)">
      <ellipse cx="0" cy="0" rx="31" ry="21" fill="#fffdf4" stroke="${ink}" stroke-width="4"/>
      <ellipse cx="0" cy="-1" rx="15" ry="12" fill="#ff9d3d" stroke="${ink}" stroke-width="3"/>
      ${face(0, -1, 0.35, "wink")}
    </g>
    <g transform="translate(44 -12) rotate(-8)">
      <rect x="-29" y="-18" width="58" height="34" rx="14" fill="#b76c47" stroke="${ink}" stroke-width="4"/>
      <path d="M-18 -10q10 8 0 16M0 -12q10 8 0 16M18 -10q10 8 0 16" fill="none" stroke="#f3bb87" stroke-width="4"/>
    </g>
    <g transform="translate(94 -5)">
      <circle cx="0" cy="0" r="17" fill="#fff" stroke="${ink}" stroke-width="4"/>
      <path d="M-10 -5q5 5 10 0t10 0M-10 4q5 5 10 0t10 0" fill="none" stroke="#ff8f9e" stroke-width="3"/>
    </g>
    <g fill="#5ca56b" stroke="${ink}" stroke-width="3">
      <path d="M-104 2q10 -16 24 -4-8 14 -24 4Z"/><path d="M108 2q-10 -16 -24 -4 8 14 24 4Z"/>
    </g>
    <g transform="translate(-82 30) rotate(4)">
      <rect x="-40" y="-15" width="80" height="27" rx="6" fill="#2c3a3e" stroke="${ink}" stroke-width="3"/>
      <text x="0" y="4" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="12" fill="#ffe8a2" letter-spacing="2">HAKATA</text>
    </g>
    <path d="M-128 -4q0 84 58 83" fill="none" stroke="#ffb7a8" stroke-width="5" stroke-linecap="round"/>
    <g transform="translate(0 -21)">
      ${face(6, 7, 0.62, "happy")}
    </g>
    <g transform="translate(96 66)">
      <path d="M0 0q-8 -24 12 -38" fill="none" stroke="#a57047" stroke-width="5" stroke-linecap="round"/>
      <path d="M0 0q-30 -12 -32 -5M0 0q-4 -20 -20 -24" fill="none" stroke="#a57047" stroke-width="4" stroke-linecap="round"/>
    </g>
  </g>
  <g transform="translate(300 54) rotate(10)">
    <rect x="-52" y="-18" width="104" height="37" rx="8" fill="#fff8e5" stroke="${ink}" stroke-width="4"/>
    <text x="0" y="6" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="17" fill="${ink}">替玉 OK!</text>
  </g>
`);

const mentaikoArt = () => wrap("mentaiko", "卡通化明太子與白飯", "#ffe1a6", `
  <g fill="#fff5d7" opacity=".55"><circle cx="58" cy="54" r="30"/><circle cx="346" cy="76" r="42"/></g>
  ${sparkle(68, 128, 0.6, "#fff")}
  <g transform="translate(204 190)">
    <ellipse cx="0" cy="46" rx="123" ry="25" fill="#d67a52" opacity=".25"/>
    <path d="M-114 10q-7 70 44 70h140q50 0 44 -70Z" fill="#fff8e9" stroke="${ink}" stroke-width="6"/>
    <ellipse cx="0" cy="10" rx="114" ry="44" fill="#f7f0dc" stroke="${ink}" stroke-width="6"/>
    <ellipse cx="0" cy="6" rx="99" ry="34" fill="#fffdf4"/>
    <g fill="#fff" stroke="${ink}" stroke-width="2.5" opacity=".9">
      <ellipse cx="0" cy="0" rx="7" ry="16"/><ellipse cx="18" cy="4" rx="6" ry="14" transform="rotate(18 18 4)"/>
      <ellipse cx="-22" cy="6" rx="6" ry="13" transform="rotate(-22 -22 6)"/><ellipse cx="40" cy="-3" rx="5" ry="12" transform="rotate(30 40 -3)"/>
      <ellipse cx="-42" cy="-2" rx="5" ry="12" transform="rotate(-30 -42 -2)"/>
    </g>
    <g transform="translate(0 -6)">
      <path d="M-62 -18q-8 -44 32 -51 37 -7 55 18 14 20 8 42-8 33 -48 30-43 -3 -47 -39Z" fill="#ff755e" stroke="${ink}" stroke-width="6"/>
      <path d="M-45 -42q15 -14 34 -8" fill="none" stroke="#ffb39e" stroke-width="6" stroke-linecap="round"/>
      <g fill="#ffd0a8" opacity=".85">
        <circle cx="-27" cy="-35" r="3.5"/><circle cx="-9" cy="-43" r="3"/><circle cx="15" cy="-41" r="3.5"/>
        <circle cx="34" cy="-29" r="3"/><circle cx="-34" cy="-16" r="3"/><circle cx="40" cy="-8" r="3"/>
        <circle cx="-21" cy="5" r="3"/><circle cx="19" cy="9" r="3"/>
      </g>
      ${face(3, -10, 0.6, "happy")}
      <path d="M-67 2q-9 -8 -14 -2M67 2q9 -8 14 -2" fill="none" stroke="${ink}" stroke-width="4" stroke-linecap="round"/>
    </g>
    <g fill="#3e6d50" stroke="${ink}" stroke-width="3">
      <path d="M-92 -4q-30 -14 -42 8 26 14 45 2Z"/><path d="M96 -8q28 -16 40 6-24 16 -43 4Z"/>
    </g>
    <path d="M-78 32h156" stroke="#6b98a8" stroke-width="5" stroke-dasharray="10 7" opacity=".6"/>
  </g>
  <g transform="translate(104 96) rotate(-42)">
    <path d="M0 -55v110" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>
    <path d="M-8 -61h16l-4 -12h-8Z" fill="#e9c18e" stroke="${ink}" stroke-width="3"/>
  </g>
  <g transform="translate(294 132) rotate(20)">
    <path d="M0 -48v96" stroke="${ink}" stroke-width="7" stroke-linecap="round"/>
    <path d="M-8 -54h16l-4 -12h-8Z" fill="#e9c18e" stroke="${ink}" stroke-width="3"/>
  </g>
  <g transform="translate(302 246)" stroke="${ink}" stroke-width="3">
    ${flower(0, 0, 0.6, "#ff9db5")}${flower(34, 8, 0.42, "#fff")}
  </g>
`);

const motsunabeArt = () => wrap("motsunabe", "卡通化牛腸鍋", "#dff4d8", `
  <defs>
    <linearGradient id="motsuBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#d8f5ce"/><stop offset="1" stop-color="#f7edc4"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#motsuBg)"/>
  <g opacity=".35" fill="#fff"><circle cx="50" cy="52" r="24"/><circle cx="352" cy="54" r="34"/></g>
  ${steam(142, 92, 1.15, "#fffdf2")}
  <g transform="translate(200 182)">
    <ellipse cx="0" cy="55" rx="135" ry="26" fill="#93a65e" opacity=".3"/>
    <path d="M-132 -10q-12 78 50 79h164q62 -1 50 -79Z" fill="#30383b" stroke="${ink}" stroke-width="6"/>
    <ellipse cx="0" cy="-10" rx="132" ry="47" fill="#4b5554" stroke="${ink}" stroke-width="6"/>
    <ellipse cx="0" cy="-8" rx="115" ry="36" fill="#c47342" stroke="${ink}" stroke-width="3"/>
    <g stroke="${ink}" stroke-width="3">
      <g fill="#e8f6c8">
        <path d="M-82 -22q20 -28 42 -4 20 -24 38 2Z"/><path d="M30 -29q26 -24 48 1 21 -24 40 2Z"/>
      </g>
      <g fill="#7dbf6c">
        <path d="M-58 7q18 -18 35 0-18 16 -35 0Z"/><path d="M22 12q20 -18 38 0-20 16 -38 0Z"/>
      </g>
      <g fill="#fff4d7">
        <rect x="-44" y="-9" width="25" height="20" rx="4" transform="rotate(-8 -44 -9)"/>
        <rect x="52" y="-17" width="26" height="20" rx="4" transform="rotate(7 52 -17)"/>
      </g>
      <g fill="#f0b28e">
        <ellipse cx="-11" cy="-9" rx="18" ry="11" transform="rotate(-12 -11 -9)"/>
        <ellipse cx="17" cy="9" rx="16" ry="9" transform="rotate(18 17 9)"/>
      </g>
      <g fill="#c9e9a3">
        <path d="M-92 9q22 -8 44 0" fill="none" stroke-width="8" stroke-linecap="round"/>
        <path d="M50 -1q28 -8 56 0" fill="none" stroke-width="8" stroke-linecap="round"/>
      </g>
    </g>
    <g transform="translate(0 18)" fill="none" stroke="#fff4d7" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
      <path d="M-30 0q8 -11 16 0M14 0q8 -11 16 0"/>
      <path d="M-8 13q8 9 16 0"/>
      <ellipse cx="-40" cy="12" rx="8" ry="4" fill="#ff9aae" stroke="none"/>
      <ellipse cx="40" cy="12" rx="8" ry="4" fill="#ff9aae" stroke="none"/>
    </g>
    <g transform="translate(-91 -62) rotate(-24)">
      <path d="M0 0v-64" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>
      <ellipse cx="0" cy="4" rx="23" ry="11" fill="#d8b07f" stroke="${ink}" stroke-width="4"/>
    </g>
    <g transform="translate(108 -30)">
      <path d="M0 0q12 -38 38 -36 24 2 15 26-7 18 -30 19" fill="#f3e3bd" stroke="${ink}" stroke-width="4"/>
      <path d="M39 -33q14 2 8 14" fill="none" stroke="${ink}" stroke-width="3"/>
    </g>
  </g>
  <g transform="translate(58 234)">
    <rect x="-33" y="-14" width="66" height="28" rx="8" fill="#ffd15c" stroke="${ink}" stroke-width="4"/>
    <text x="0" y="5" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="12" fill="${ink}">MOTSU</text>
  </g>
  ${sparkle(330, 168, 0.55, "#fff")}
`);

const nanbanArt = () => wrap("nanban", "卡通化雞肉南蠻", "#ffe0e8", `
  <g fill="#fff6ee" opacity=".6"><circle cx="58" cy="54" r="26"/><circle cx="338" cy="46" r="36"/></g>
  <g transform="translate(200 172)">
    <ellipse cx="0" cy="48" rx="140" ry="30" fill="#e3a2a2" opacity=".35"/>
    <ellipse cx="0" cy="28" rx="140" ry="56" fill="#fffaf0" stroke="${ink}" stroke-width="6"/>
    <ellipse cx="0" cy="22" rx="122" ry="44" fill="#f4ead8" stroke="${ink}" stroke-width="3"/>
    <g>
      <g transform="translate(-54 -8) rotate(-10)">
        <path d="M-42 -18q-10 -28 20 -32 32 -4 42 22 8 24 -13 35-32 16 -49 -25Z" fill="#e7a44b" stroke="${ink}" stroke-width="5"/>
        <path d="M-34 -27q18 -12 44 0M-38 -9q20 12 46 0" fill="none" stroke="#f7cd82" stroke-width="5" stroke-linecap="round"/>
        ${face(0, -3, 0.55, "wink")}
      </g>
      <g transform="translate(57 2) rotate(8)">
        <path d="M-36 -20q-4 -24 25 -24 30 0 34 26 3 24 -22 28-31 4 -37 -30Z" fill="#edb65f" stroke="${ink}" stroke-width="5"/>
        <path d="M-24 -24q18 -10 42 0" fill="none" stroke="#ffe1a8" stroke-width="5" stroke-linecap="round"/>
        ${face(2, 0, 0.44, "happy")}
      </g>
      <g transform="translate(-12 -38) rotate(-3)">
        <path d="M-24 0q-5 -19 15 -19 20 0 20 19 0 16 -16 16-16 0 -19 -16Z" fill="#fffdf2" stroke="${ink}" stroke-width="4"/>
        <path d="M-12 -4q7 -8 14 0M4 -2q6 -7 12 0" fill="none" stroke="#d9d2ba" stroke-width="3"/>
      </g>
    </g>
    <g transform="translate(94 16)">
      <path d="M0 -30q28 5 26 32-2 24 -26 22Z" fill="#ffe46e" stroke="${ink}" stroke-width="5"/>
      <path d="M8 18q14 -4 12 -20" fill="none" stroke="#e8bf3b" stroke-width="4"/>
    </g>
    <g fill="#5aa86c" stroke="${ink}" stroke-width="3">
      <path d="M-96 24q-18 -20 -34 -8 12 22 34 8Z"/><path d="M92 30q16 -22 32 -10-10 22 -32 10Z"/>
    </g>
    <g fill="#ffd7e2" stroke="${ink}" stroke-width="3">
      <ellipse cx="-2" cy="34" rx="42" ry="12" opacity=".9"/>
    </g>
    <path d="M-66 42q60 16 132 0" fill="none" stroke="#d7c6a8" stroke-width="4" stroke-linecap="round"/>
  </g>
  <g transform="translate(316 88) rotate(9)">
    <rect x="-58" y="-19" width="116" height="37" rx="8" fill="#ff8fa8" stroke="${ink}" stroke-width="4"/>
    <text x="0" y="6" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="15" fill="${ink}">TARTAR!</text>
  </g>
  ${heart(70, 118, 0.7)}
  ${sparkle(342, 194, 0.5, "#fff")}
`);

const umegaeArt = () => wrap("umegae", "卡通化梅ヶ枝餅與茶", "#efe0ff", `
  <defs>
    <linearGradient id="umeBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#e9d4ff"/><stop offset="1" stop-color="#fff0dd"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#umeBg)"/>
  <g fill="#fff" opacity=".5"><circle cx="54" cy="44" r="24"/><circle cx="338" cy="64" r="32"/></g>
  <g stroke="${ink}" stroke-width="6" stroke-linecap="round" fill="none">
    <path d="M22 74q74 -50 144 -2"/>
    <path d="M62 58q-8 26 -30 38M104 42q-2 30 -18 46M146 50q14 16 12 34"/>
  </g>
  <g fill="#ffa8c2" stroke="${ink}" stroke-width="3">
    ${[[46,96],[90,80],[132,82],[170,78]].map(([x,y])=>`<g transform="translate(${x} ${y})"><circle cx="-8" cy="0" r="7"/><circle cx="8" cy="0" r="7"/><circle cx="0" cy="-8" r="7"/><circle cx="0" cy="8" r="7"/><circle cx="0" cy="0" r="4" fill="#ff6f91"/></g>`).join("")}
  </g>
  <g transform="translate(208 190)">
    <ellipse cx="0" cy="44" rx="132" ry="28" fill="#c5a6ca" opacity=".3"/>
    <ellipse cx="0" cy="23" rx="130" ry="43" fill="#fffdf4" stroke="${ink}" stroke-width="6"/>
    <ellipse cx="0" cy="17" rx="110" ry="32" fill="#f5ead3"/>
    <g transform="translate(-40 0)">
      <ellipse cx="0" cy="7" rx="65" ry="47" fill="#f6c77d" stroke="${ink}" stroke-width="6"/>
      <ellipse cx="0" cy="-5" rx="62" ry="44" fill="#ffd895" stroke="${ink}" stroke-width="3"/>
      <g stroke="#d89d52" stroke-width="4" opacity=".65">
        <path d="M-48 -16q30 16 62 0M-52 2q34 18 68 0M-48 20q28 16 60 0"/>
      </g>
      <g transform="translate(0 -7)">
        <g fill="#ff8eac" stroke="${ink}" stroke-width="3">
          <circle cx="0" cy="-20" r="9"/><circle cx="19" cy="-6" r="9"/><circle cx="12" cy="17" r="9"/>
          <circle cx="-12" cy="17" r="9"/><circle cx="-19" cy="-6" r="9"/>
        </g>
        <circle cx="0" cy="0" r="6" fill="#ffe16b" stroke="${ink}" stroke-width="3"/>
      </g>
      ${face(-2, 24, 0.46, "happy")}
    </g>
    <g transform="translate(84 -10) rotate(5)">
      <ellipse cx="0" cy="13" rx="35" ry="11" fill="#d7c8ad"/>
      <path d="M-27 -10q-2 28 27 28 29 0 27 -28Z" fill="#fffdf4" stroke="${ink}" stroke-width="4"/>
      <ellipse cx="0" cy="-10" rx="27" ry="9" fill="#c3e0b8" stroke="${ink}" stroke-width="4"/>
      <ellipse cx="0" cy="-10" rx="21" ry="6" fill="#a7ce92"/>
      ${steam(0, -20, 0.5, "#fff")}
    </g>
    <g fill="#5b9e68" stroke="${ink}" stroke-width="3">
      <path d="M-110 16q-24 -8 -34 8 22 14 36 -2Z"/>
    </g>
    <path d="M-94 29h188" stroke="#d7c6a8" stroke-width="3" stroke-dasharray="8 8" opacity=".7"/>
  </g>
  <g transform="translate(306 236) rotate(6)">
    <rect x="-30" y="-15" width="60" height="30" rx="6" fill="#fff6dc" stroke="${ink}" stroke-width="4"/>
    <text x="0" y="5" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="12" fill="${ink}">¥150</text>
  </g>
  ${heart(89, 151, 0.6)}
`);

const yataiArt = () => wrap("yatai", "卡通化博多屋台之夜", "#26374f", `
  <defs>
    <linearGradient id="yataiSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#1c304a"/><stop offset=".65" stop-color="#345366"/><stop offset="1" stop-color="#ef8b63"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#yataiSky)"/>
  <g fill="#ffe8a8">
    <circle cx="44" cy="38" r="2.5"/><circle cx="98" cy="24" r="2"/><circle cx="162" cy="44" r="2.5"/>
    <circle cx="236" cy="22" r="2"/><circle cx="294" cy="48" r="2.5"/><circle cx="358" cy="28" r="2"/>
    <circle cx="330" cy="94" r="2"/><circle cx="66" cy="92" r="1.8"/>
  </g>
  <circle cx="324" cy="54" r="26" fill="#ffe7a2" stroke="${ink}" stroke-width="4"/>
  ${cloud(72, 76, 0.48, 0.2)}
  <g transform="translate(196 184)">
    <path d="M-112 -2q-8 78 52 80h120q60 -2 52 -80Z" fill="#a66642" stroke="${ink}" stroke-width="6"/>
    <rect x="-104" y="-60" width="208" height="64" rx="6" fill="#f1d9a8" stroke="${ink}" stroke-width="5"/>
    <g stroke="${ink}" stroke-width="3">
      <path d="M-104 -26h208"/>
      <g fill="#e15a4f"><rect x="-88" y="-53" width="32" height="24" rx="3"/><rect x="-48" y="-53" width="32" height="24" rx="3"/><rect x="36" y="-53" width="32" height="24" rx="3"/><rect x="76" y="-53" width="25" height="24" rx="3"/></g>
      <g fill="#ffe8b0"><rect x="-8" y="-53" width="32" height="24" rx="3"/></g>
    </g>
    <path d="M-120 -58q120 -58 240 0l-10 18q-110 -48 -220 0Z" fill="#d8544c" stroke="${ink}" stroke-width="5"/>
    <path d="M-120 -58q120 -58 240 0" fill="none" stroke="#ffd369" stroke-width="5"/>
    <g transform="translate(0 6)">
      ${face(-4, 22, 0.65, "happy")}
    </g>
    <g transform="translate(-96 -52)">
      <path d="M-18 0q-2 -26 18 -26 20 0 18 26Z" fill="#ffcf63" stroke="${ink}" stroke-width="4"/>
      ${face(0, -15, 0.3, "wink")}
    </g>
    <g transform="translate(98 -50)">
      <path d="M-18 0q-2 -26 18 -26 20 0 18 26Z" fill="#ffcf63" stroke="${ink}" stroke-width="4"/>
      ${face(0, -15, 0.3, "happy")}
    </g>
    <g transform="translate(-74 76)">
      <ellipse cx="0" cy="0" rx="28" ry="8" fill="#f3e0bd" stroke="${ink}" stroke-width="4"/>
      <circle cx="0" cy="8" r="12" fill="#f1d9a8" stroke="${ink}" stroke-width="4"/>
      <path d="M-14 38q14 -8 28 0" fill="none" stroke="${ink}" stroke-width="4"/>
    </g>
    <g transform="translate(58 78)">
      <ellipse cx="0" cy="0" rx="28" ry="8" fill="#f3e0bd" stroke="${ink}" stroke-width="4"/>
      <circle cx="0" cy="8" r="12" fill="#f1d9a8" stroke="${ink}" stroke-width="4"/>
      <path d="M-14 38q14 -8 28 0" fill="none" stroke="${ink}" stroke-width="4"/>
    </g>
    <g transform="translate(0 -72)">
      <path d="M-58 0q58 -26 116 0" fill="none" stroke="${ink}" stroke-width="3"/>
      <g fill="#ffe7a2" stroke="${ink}" stroke-width="3">
        <rect x="-52" y="-9" width="22" height="26" rx="8"/><rect x="-10" y="-15" width="22" height="29" rx="8"/>
        <rect x="31" y="-9" width="22" height="26" rx="8"/>
      </g>
      <g fill="#ff9d5c"><circle cx="-41" cy="5" r="3"/><circle cx="1" cy="-2" r="3"/><circle cx="42" cy="5" r="3"/></g>
    </g>
  </g>
  <g transform="translate(68 232)">
    <path d="M0 -36v-24M0 -36h54" stroke="${ink}" stroke-width="5" stroke-linecap="round"/>
    <rect x="-26" y="-14" width="52" height="32" rx="6" fill="#ffe7a2" stroke="${ink}" stroke-width="4"/>
    <text x="0" y="8" text-anchor="middle" font-family="Arial Black, sans-serif" font-size="11" fill="${ink}">YATAI</text>
  </g>
  <g transform="translate(332 246)">
    <path d="M-30 0h60M-22 0v-22M22 0v-22" stroke="${ink}" stroke-width="4"/>
    <path d="M-36 -22h72" stroke="${ink}" stroke-width="6" stroke-linecap="round"/>
  </g>
`);

const artMap = {
  tower: towerArt,
  ohori: ohoriArt,
  dazaifu: dazaifuArt,
  kushida: kushidaArt,
  uminaka: uminakaArt,
  itoshima: itoshimaArt,
  ramen: ramenArt,
  mentaiko: mentaikoArt,
  motsunabe: motsunabeArt,
  nanban: nanbanArt,
  umegae: umegaeArt,
  yatai: yataiArt,
};

export function getArt(id) {
  const fn = artMap[id];
  return fn ? fn() : "";
}
