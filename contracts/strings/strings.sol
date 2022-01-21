//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./slice.sol";

library lib_strings {
	using lib_strings_slice for lib_strings_slice.slice;
	using lib_strings_slice for string;

	function concat(string memory self, string memory other) internal pure returns (string memory) {
		return self.toSlice().concat(other.toSlice());
	}
}
