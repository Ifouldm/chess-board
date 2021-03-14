"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
before(() => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('Setting up env');
}));
after(() => __awaiter(void 0, void 0, void 0, function* () {
    // console.log('removing env');
}));
describe('Set scores function', () => {
    it('Test 1', () => __awaiter(void 0, void 0, void 0, function* () {
        chai_1.assert.equal(5, 2 + 3, '2 + 3 = 5');
    }));
    it('Test 1', () => __awaiter(void 0, void 0, void 0, function* () {
        chai_1.assert.equal('2 + 3', '2 + 3', '\'2 + 3\' = \'2 + 3\'');
    }));
});
