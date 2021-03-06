/* Copyright 2018 evan.network GmbH
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import 'mocha';
import { expect } from 'chai';

import { accounts } from './test/accounts';
import { config } from './config';
import { NameResolver } from './name-resolver';
import { TestUtils } from './test/test-utils';

const testAddressValue = '0x0000000000000000000000000000000000000123';
const emptyAddressValue = '0x0000000000000000000000000000000000000000';
let web3;

describe('NameResolver class', function() {
  this.timeout(600000);

  before(() => {
    web3 = TestUtils.getWeb3();
  });

  after(() => {
    web3.currentProvider.connection.close();
  });

  it('should be able to be created', async () => {
    const nameResolver = await TestUtils.getNameResolver(web3);
    expect(nameResolver).not.to.be.undefined;
  });

  it('should be able to resolve an ENS name', async () => {
    const nameResolver = await TestUtils.getNameResolver(web3);
    const address = await nameResolver.getAddress(
      nameResolver.getDomainName(config.nameResolver.domains.root));
    expect(address).to.not.eq('0x0000000000000000000000000000000000000000');
    expect(address).to.not.eq('0x0');
    expect(address).to.not.eq('0x');
  });

  it('should be able to set an ENS name', async () => {
    const nameResolver = await TestUtils.getNameResolver(web3);
    const testAddress = `foo.${nameResolver.getDomainName(config.nameResolver.domains.root)}`;
    await nameResolver.setAddress(testAddress, testAddressValue, accounts[0], accounts[0]);

    let address;
    address = await nameResolver.getAddress(testAddress);
    expect(address).to.eq(testAddressValue);

    await nameResolver.setAddress(testAddress, emptyAddressValue, accounts[0], accounts[0]);
    address = await nameResolver.getAddress(testAddress);
    expect(address).to.eq(emptyAddressValue);
  });
});
