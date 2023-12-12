// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {ERC20} from "solady/src/tokens/ERC20.sol";
import {MockERC20} from "solady/test/utils/mocks/MockERC20.sol";

contract MockAAVE {
    function supply(address token, uint256 amount) external {
        ERC20(token).transferFrom(msg.sender, address(this), amount);
    }

    function borrow(address token, uint256 amount) external {
        ERC20(token).transfer(msg.sender, amount);
    }
}

contract BenchMockAAVE {
    MockAAVE mockAAVE = new MockAAVE();
    MockERC20 token = new MockERC20("MK", "Mock", 18);

    function setUp() external {
        token.mint(address(this), 1 ether);
    }

    function testBench() external {
        token.approve(address(mockAAVE), 1 ether);
        mockAAVE.supply(address(token), 1 ether);
        mockAAVE.borrow(address(token), 1 ether);
    }
}
