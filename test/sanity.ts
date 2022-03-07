import { contract, ether, maxUint256, useChaiBN, zero } from "@defi.org/web3-candies";
import { expect } from "chai";
import { impersonate, setBalance } from "@defi.org/web3-candies/dist/hardhat";
import type { Elections } from "../typechain-abi/Elections";

useChaiBN();

describe("Sanity", () => {
  it("just works", async () => {
    expect(zero).bignumber.eq("0");
    expect(ether).bignumber.gt(zero);
  });

  it("impersonate and set state", async () => {
    const elections = contract<Elections>(require("../abi/Elections.json"), "0x02Ca9F2c5dD0635516241efD480091870277865b");
    const admin = await elections.methods.registryAdmin().call();
    await impersonate(admin);
    await setBalance(admin, maxUint256);

    expect(await elections.methods.getMinSelfStakePercentMille().call()).bignumber.eq("8000");

    await elections.methods.setMinSelfStakePercentMille(0).send({ from: admin });
    expect(await elections.methods.getMinSelfStakePercentMille().call()).bignumber.zero;
  });
});
