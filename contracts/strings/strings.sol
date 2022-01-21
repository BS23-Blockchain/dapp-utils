//SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "./slice.sol";

library lib_strings {
	using lib_strings_slice for lib_strings_slice.slice;
	using lib_strings_slice for string;

	/**
	 * @dev
	 *	Returns a newly allocated string containing the concatenation of
	 *  `self` and `other`.
	 *
	 * @param self The first string to concatenate.
	 * @param other The second string to concatenate.
	 * @return The concatenation of the two strings.
	 */
	function concat(string memory self, string memory other) internal pure returns (string memory) {
		return self.toSlice().concat(other.toSlice());
	}

	/**
	 * @dev
	 *	Joins an array of strings, using `self` as a delimiter, returning a
	 *	newly allocated string.
	 *
	 * @param self The delimiter to use.
	 * @param parts A list of string to join.
	 * @return A newly allocated string containing all the slices in `parts`,
	 *         joined with `self`.
	 */
	function join(string memory self, string[] memory parts) internal pure returns (string memory) {
		lib_strings_slice.slice[] memory partsInSlice = new lib_strings_slice.slice[](parts.length);
		for (uint i = 0; i < parts.length; i++) {
			partsInSlice[i] = parts[i].toSlice();
		}
		return self.toSlice().join(partsInSlice);
	}
}
