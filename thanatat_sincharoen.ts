function minEnergy(
  start: number,
  shops: number[],
  stations: number[],
  target: number
): number {
  // Table for shop positions
  const shopObj: { [key: number]: boolean } = {};
  for (let i = 0; i < shops.length; i++) {
    shopObj[shops[i]] = true;
  }

  // Table for station positions
  const stationObj: { [key: number]: boolean } = {};
  for (let i = 0; i < stations.length; i++) {
    stationObj[stations[i]] = true;
  }

  const queue: [number, string, number][] = []; // [position, bitmask, energy]

  const visited: { [key: number]: { [key: string]: boolean } } = {}; // visited[position][bitmask]

  let initialVisited = "";

  for (let i = 0; i < shops.length; i++) {
    initialVisited += shops[i] === start ? "1" : "0";
  }

  queue.push([start, initialVisited, 0]); // Start energy = 0

  visited[start] = {};
  visited[start][initialVisited] = true;

  while (queue.length > 0) {
    const [pos, visitedShopKey, energy] = queue.shift()!;

    // Reach target & visited all shops (No 0 in key)
    if (pos === target && visitedShopKey.indexOf("0") === -1) {
      return energy;
    }

    // Try all moves
    for (let d = -1; d <= 1; d += 2) {
      const next = pos + d;
      // Skip if out of bound
      if (next < 0 || next > 100) { // (Assume that upper boundary = 100 since the description doesnt specify)
        continue;
      }

      let newVisitedKey = visitedShopKey;
      
      for (let i = 0; i < shops.length; i++) {
        if (shops[i] === next && visitedShopKey[i] === "0") {
          newVisitedKey = visitedShopKey.substring(0, i) + "1" + visitedShopKey.substring(i + 1);
          break;
        }
      }

      // Already visited
      if (!visited[next]) {
        visited[next] = {};
      }
      
      if (!visited[next][newVisitedKey]) {
        visited[next][newVisitedKey] = true;
        queue.push([next, newVisitedKey, energy + 1]);
      }
    }

    // Traverse by bus
    if (stationObj[pos]) {
      for (let i = 0; i < stations.length; i++) {
        const station = stations[i];

        if (station === pos) {
            continue;
        }

        let newVisitedKey = visitedShopKey;
        for (let j = 0; j < shops.length; j++) {
          if (shops[j] === station && visitedShopKey[j] === "0") {
            newVisitedKey = visitedShopKey.substring(0, j) + "1" + visitedShopKey.substring(j + 1);
            break;
          }
        }

        if (!visited[station]) {
            visited[station] = {};
        }

        if (!visited[station][newVisitedKey]) {
          visited[station][newVisitedKey] = true;
          queue.push([station, newVisitedKey, energy]);
        }
      }
    }
  }

  // Die if no path found
  return -1;
}

console.log(minEnergy(2, [4, 9], [3, 6, 8], 7));

// just for testing: case no station
console.log(minEnergy(1, [2, 3], [], 5));

// just for testing: case one station at the start
console.log(minEnergy(1, [9], [1, 8], 10));
