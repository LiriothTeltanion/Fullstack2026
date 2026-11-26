# Game regression tests

Run `npm test` from the exercise directory. Node's built-in runner checks turns, immutable boards, all eight winning lines, invalid moves, draws, winning/blocking computer moves and every reachable human reply against the deterministic computer strategy. No network or browser installation is required.

The separate private browser verification mounts the actual production app and covers mode buttons, keyboard play, switching/reset during the delayed computer turn, wins/draws and small screens. Node logic tests alone do not establish rendered accessibility.
