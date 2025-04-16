// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function balanceOf(address who) external view returns (uint256);
    function decimals() external view returns (uint8);
    function name() external view returns (string memory);
    function symbol() external view returns (string memory);
    function allowance(address owner, address spender) external view returns (uint256);
}

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;

    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _notEntered will be true
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");

        // Any calls to nonReentrant after this point will fail
        _status = _ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = _NOT_ENTERED;
    }
}
library SafeMath {
    /**

    * @dev Multiplies two unsigned integers, reverts on overflow.

    */

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        // Gas optimization: this is cheaper than requiring 'a' not being zero, but the

        // benefit is lost if 'b' is also tested.

        // See: https://github.com/OpenZeppelin/openzeppelin-solidity/pull/522

        if (a == 0) {
            return 0;
        }

        uint256 c = a * b;

        require(c / a == b);

        return c;
    }

    /**

    * @dev Integer division of two unsigned integers truncating the quotient, reverts on division by zero.

    */

    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        // Solidity only automatically asserts when dividing by 0

        require(b > 0);

        uint256 c = a / b;

        // assert(a == b * c + a % b); // There is no case in which this doesn't hold

        return c;
    }

    /**

    * @dev Subtracts two unsigned integers, reverts on overflow (i.e. if subtrahend is greater than minuend).

    */

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a);

        uint256 c = a - b;

        return c;
    }

    /**

    * @dev Adds two unsigned integers, reverts on overflow.

    */

    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;

        require(c >= a);

        return c;
    }

    /**

    * @dev Divides two unsigned integers and returns the remainder (unsigned integer modulo),

    * reverts when dividing by zero.

    */

    function mod(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b != 0);

        return a % b;
    }
}

abstract contract Context {	
    function _msgSender() internal view virtual returns (address) {	
        return msg.sender;	
    }	
    function _msgData() internal view virtual returns (bytes calldata) {	
        return msg.data;	
    }	
}	
abstract contract Pausable is Context {	
    /**	
     * @dev Emitted when the pause is triggered by `account`.	
     */	
    event Paused(address account);	
    /**	
     * @dev Emitted when the pause is lifted by `account`.	
     */	
    event Unpaused(address account);	
    bool private _paused;	
    /**	
     * @dev Initializes the contract in unpaused state.	
     */	
    constructor() {	
        _paused = false;	
    }	
    /**	
     * @dev Returns true if the contract is paused, and false otherwise.	
     */	
    function paused() public view virtual returns (bool) {	
        return _paused;	
    }	
    /**	
     * @dev Modifier to make a function callable only when the contract is not paused.	
     *	
     * Requirements:	
     *	
     * - The contract must not be paused.	
     */	
    modifier whenNotPaused() {	
        require(!paused(), "Pausable: paused");	
        _;	
    }	
    /**	
     * @dev Modifier to make a function callable only when the contract is paused.	
     *	
     * Requirements:	
     *	
     * - The contract must be paused.	
     */	
    modifier whenPaused() {	
        require(paused(), "Pausable: not paused");	
        _;	
    }	
    /**	
     * @dev Triggers stopped state.	
     *	
     * Requirements:	
     *	
     * - The contract must not be paused.	
     */	
    function _pause() internal virtual whenNotPaused {	
        _paused = true;	
        emit Paused(_msgSender());	
    }	
    /**	
     * @dev Returns to normal state.	
     *	
     * Requirements:	
     *	
     * - The contract must be paused.	
     */	
    function _unpause() internal virtual whenPaused {	
        _paused = false;	
        emit Unpaused(_msgSender());	
    }	
}

contract Ownable   {
    address private _owner;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    /**

     * @dev Initializes the contract setting the deployer as the initial owner.

     */

    constructor()  {
        _owner = msg.sender;

        emit OwnershipTransferred(address(0), _owner);
    }

    /**

     * @dev Returns the address of the current owner.

     */

    function owner() public view returns (address) {
        return _owner;
    }

    /**

     * @dev Throws if called by any account other than the owner.

     */

    modifier onlyOwner() {
        require(_owner == msg.sender, "Ownable: caller is not the owner");

        _;
    }

    /**

     * @dev Transfers ownership of the contract to a new account (`newOwner`).

     * Can only be called by the current owner.

     */

    function transferOwnership(address newOwner) public onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );

        emit OwnershipTransferred(_owner, newOwner);

        _owner = newOwner;
    }
}

contract StakeFactory is Ownable, Pausable, ReentrancyGuard {
    IERC20 public Token;
    IERC20 public rewardToken;

    bool public IS_ULTIMATE_STAKE_FACTORY = true;

    uint8 public depositTokenDecimals;
    uint8 public rewardTokenDecimals;

    struct UserInfo {
        address Address;
        uint256 DepositeTokenTotal;
        uint256 LastUpdated;
        uint256[] LockableDays;
        uint256[] DepositeTokens;
        uint256[] DepositeTime;
        uint256 WithdrawedReward;
        uint256 WithdrawAbleReward;
    }

    event Deposite_(address indexed to, address indexed From, uint256 amount, uint256 day, uint256 time);

    mapping(uint256 => uint256) public allocation; // Процентные ставки для разных периодов блокировки
    mapping(uint256 => LockPeriodParams) public lockPeriodParams; // Параметры для каждого периода блокировки
    address public taxreceiver;

    mapping(address => uint256[]) public depositeToken;
    mapping(address => uint256) public depositeTokensTotal;
    mapping(address => uint256[]) public lockableDays;
    mapping(address => uint256[]) public depositeTime;
    mapping(address => uint256) public withdrawedReward;
    mapping(address => uint256) public lastUpdated;


    mapping(address => bool) public usersExists;
    mapping(uint256 => address) public users;
    uint256 public usersCount;

    mapping(address => bool) public isSpam;

    uint256 public deductionPercentage = 2500; // 25% = 2500 базисных пунктов

    // Dev = 1 minute = 1 day
    uint256 public time = 60; // 3600; //days;

    uint256[] public allowedLockPeriods; // Массив допустимых периодов блокировки

    struct LockPeriodParams {
        uint256 lockTimeDays;
        uint256 minimumDeposit;
        uint256 percentageBasisPoints;
        uint256 maxRate;            // Максимальная процентная ставка
        uint256 minRate;            // Минимальная процентная ставка
        uint256 decrementStep;      // Шаг снижения ставки
        uint256 stepSize;           // Размер шага в токенах
        bool    fixedBasisPoints;   // Фиксированная ставка APY
        uint256 stakedAmount;       // Кол-во застейканых токенов
    }

    constructor(IERC20 _token, IERC20 _rewardToken, address _taxreceiver, uint256 _deductionPercentage, LockPeriodParams[] memory _initLockPeriods) {
        Token = _token;
        rewardToken = _rewardToken;
        deductionPercentage = _deductionPercentage;
        depositTokenDecimals = Token.decimals();
        rewardTokenDecimals = rewardToken.decimals();

        taxreceiver = _taxreceiver;

        // Установка начальных параметров для примера
        for (uint256 i = 0; i < _initLockPeriods.length; i++) {
            setAllocation(
                _initLockPeriods[i].lockTimeDays,
                _initLockPeriods[i].minimumDeposit,
                _initLockPeriods[i].percentageBasisPoints,
                _initLockPeriods[i].maxRate,
                _initLockPeriods[i].minRate,
                _initLockPeriods[i].decrementStep,
                _initLockPeriods[i].stepSize,
                _initLockPeriods[i].fixedBasisPoints
            );
            
        }
    }

    // Функция для создания депозита
    function deposit(uint256 _amount, uint256 _lockDays) external whenNotPaused nonReentrant {
        require(isSpam[msg.sender] == false, "Account is spam!");
        require(isLockPeriodAllowed(_lockDays), "Invalid lock period");
        require(_amount >= lockPeriodParams[_lockDays].minimumDeposit, "Invalid amount");

        uint256 blockTime = block.timestamp;

        Token.transferFrom(msg.sender, address(this), _amount);
        depositeToken[msg.sender].push(_amount);
        depositeTime[msg.sender].push(uint40(blockTime));
        depositeTokensTotal[msg.sender] += _amount;
        lockableDays[msg.sender].push(_lockDays);
        lastUpdated[msg.sender] = block.timestamp;
        lockPeriodParams[_lockDays].stakedAmount += _amount;
        if (!usersExists[msg.sender]) {
            usersCount++;
            users[usersCount] = msg.sender;
            usersExists[msg.sender] = true;
        }
        allocationPercentageUpdate(); // Обновляем процентные ставки
        emit Deposite_(msg.sender, address(this), _amount, _lockDays, blockTime);
    }

    // Функция для расчета вознаграждений
    function pendingRewards(address _address) public view returns (uint256 reward) {
        uint256 totalReward;
        uint256 blockTime = block.timestamp;
        for (uint256 z = 0; z < depositeToken[_address].length; z++) {
            uint256 lockTime = depositeTime[_address][z] + (lockableDays[_address][z] * time);

            if (blockTime > lockTime) {
                uint256 calculatedReward = (depositeToken[_address][z] * allocation[lockableDays[_address][z]]) / 10000;
                calculatedReward = convertTokenAToTokenB(calculatedReward, depositTokenDecimals, rewardTokenDecimals);

                totalReward += calculatedReward;
            }
        }

        return totalReward;
    }

    function getUser(address user) public view returns (UserInfo memory info) {
        info = UserInfo({
            Address: user,
            DepositeTokenTotal: depositeTokensTotal[user],
            DepositeTokens: depositeToken[user],
            LastUpdated: lastUpdated[user],
            LockableDays: lockableDays[user],
            WithdrawedReward: withdrawedReward[user],
            WithdrawAbleReward: pendingRewards(user),
            DepositeTime: depositeTime[user]
        });
    }
    function getUsers(uint256 _offset, uint256 _limit) public view returns(UserInfo[] memory ret) {
        if (_limit == 0) _limit = usersCount;
        uint256 iEnd = _offset + _limit;
        if (iEnd > usersCount) usersCount;

        ret = new UserInfo[](iEnd - _offset);
        for (uint256 i = 0; i < iEnd - _offset ; i++) {
            ret[i] = getUser(
                users[
                    usersCount - i - _offset
                ]
            );
        }
    }
    // Функция для вывода средств
    function harwest(uint256[] memory _index) external whenNotPaused nonReentrant returns (
        uint256 _totalWithdrawAmount,
        uint256 _totalReward,
        uint256 _deductionFee
    ){
        require(isSpam[msg.sender] == false, "Account is spam!");

        uint256 totalWithdrawAmount;
        uint256 totalReward;
        uint256 deductionFee;
        uint256 depositedTokens = depositeTokensTotal[msg.sender]; 
        uint256 blockTime = block.timestamp;

        for (uint256 z = 0; z < _index.length; z++) {
            //require(Users[msg.sender].DepositeToken > 0, "Deposite not");
            if (depositeToken[msg.sender][_index[z]] > 0) {
                uint256 lockTime = depositeTime[msg.sender][_index[z]] + (lockableDays[msg.sender][_index[z]] * time);

                if (blockTime > lockTime) {
                    uint256 reward = (depositeToken[msg.sender][_index[z]] * allocation[lockableDays[msg.sender][_index[z]]]) / 10000;
                    reward = convertTokenAToTokenB(reward, depositTokenDecimals, rewardTokenDecimals);

                    
                    totalReward += reward;
                    totalWithdrawAmount += depositeToken[msg.sender][_index[z]];
                } else {
                    uint256 a;
                    if (deductionPercentage > 0) {
                        a = (depositeToken[msg.sender][_index[z]] * deductionPercentage) / 10000;
                    }
                    uint256 b = depositeToken[msg.sender][_index[z]] - a;

                    totalWithdrawAmount += b;
                    
                    deductionFee += a;
                }
                lockPeriodParams[
                    lockableDays[msg.sender][_index[z]]
                ].stakedAmount -= depositeToken[msg.sender][_index[z]];
                depositedTokens -= depositeToken[msg.sender][_index[z]];
            }
        }

        // Effects: Обновляем состояние контракта
        for (uint256 t = 0; t < _index.length; t++) {
            for (uint256 i = _index[t]; i < depositeToken[msg.sender].length - 1; i++) {
                depositeToken[msg.sender][i] = depositeToken[msg.sender][i + 1];
                lockableDays[msg.sender][i] = lockableDays[msg.sender][i + 1];
                depositeTime[msg.sender][i] = depositeTime[msg.sender][i + 1];
            }
            depositeToken[msg.sender].pop();
            lockableDays[msg.sender].pop();
            depositeTime[msg.sender].pop();
        }

        if (totalWithdrawAmount > 0) {
            Token.transfer(msg.sender, totalWithdrawAmount);
        }

        if (totalReward > 0) {
            rewardToken.transfer(msg.sender, totalReward);
        }

        if (deductionFee > 0) {
            Token.transfer(taxreceiver, deductionFee);
        }
        depositeTokensTotal[msg.sender] = depositedTokens;
        withdrawedReward[msg.sender] += totalReward;
        lastUpdated[msg.sender] = block.timestamp;

        return (totalWithdrawAmount, totalReward, deductionFee);
    }

    // Функция для установки процентной ставки и параметров
    function setAllocation(
        uint256 _days,
        uint256 _minimumDeposit,
        uint256 percentageBasisPoints,
        uint256 _maxRate,
        uint256 _minRate,
        uint256 _decrementStep,
        uint256 _stepSize,
        bool    _fixedBasisPoints
    ) public onlyOwner {
        require(percentageBasisPoints <= 10000, "Invalid percentage");
        require(_maxRate >= _minRate, "Max rate must be greater than or equal to min rate");
        require(_stepSize > 0, "Step size must be greater than 0");

        allocation[_days] = percentageBasisPoints;

        if (!isLockPeriodAllowed(_days)) {
            allowedLockPeriods.push(_days); // Добавляем период в список допустимых
        }

        // Устанавливаем параметры для данного периода
        lockPeriodParams[_days] = LockPeriodParams({
            percentageBasisPoints:  percentageBasisPoints,
            minimumDeposit:         _minimumDeposit,
            lockTimeDays:           _days,
            maxRate:                _maxRate,
            minRate:                _minRate,
            decrementStep:          _decrementStep,
            stepSize:               _stepSize,
            fixedBasisPoints:       _fixedBasisPoints,
            stakedAmount:           lockPeriodParams[_days].stakedAmount
        });
    }

    // Функция для проверки допустимых периодов блокировки
    function isLockPeriodAllowed(uint256 _days) internal view returns (bool) {
        for (uint256 i = 0; i < allowedLockPeriods.length; i++) {
            if (allowedLockPeriods[i] == _days) {
                return true;
            }
        }
        return false;
    }

    // Функция для удаления периода блокировки
    function removeLockPeriod(uint256 _days) external onlyOwner {
        require(isLockPeriodAllowed(_days), "Lock period not found");

        uint256 indexToRemove;
        bool found = false;

        for (uint256 i = 0; i < allowedLockPeriods.length; i++) {
            if (allowedLockPeriods[i] == _days) {
                indexToRemove = i;
                found = true;
                break;
            }
        }

        require(found, "Lock period not found");
        delete lockPeriodParams[_days];
        for (uint256 i = indexToRemove; i < allowedLockPeriods.length - 1; i++) {
            allowedLockPeriods[i] = allowedLockPeriods[i + 1];
        }
        allowedLockPeriods.pop();
    }

    // Функция для получения списка допустимых периодов блокировки
    function getLockPeriods() external view returns (uint256[] memory) {
        return allowedLockPeriods;
    }
    function getLockPeriodsInfo() external view returns (LockPeriodParams[] memory ret) {
        if (allowedLockPeriods.length > 0) {
            ret = new LockPeriodParams[](allowedLockPeriods.length);
            for (uint256 i = 0; i < allowedLockPeriods.length; i++) {
                ret[i] = lockPeriodParams[allowedLockPeriods[i]];
            }
        }
    }
    function getStakeTokenInfo() public view returns (
        address addr,
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 balance
    ) {
        addr = address(Token);
        name = Token.name();
        symbol = Token.symbol();
        decimals = Token.decimals();
        balance = Token.balanceOf(address(this));
    }
    function getRewardTokenInfo() public view returns (
        address addr,
        string memory name,
        string memory symbol,
        uint8 decimals,
        uint256 balance
    ) {
        addr = address(rewardToken);
        name = rewardToken.name();
        symbol = rewardToken.symbol();
        decimals = rewardToken.decimals();
        balance = rewardToken.balanceOf(address(this));
    }
    // Функция для обновления процентных ставок
    function allocationPercentageUpdate() internal {
        uint256 tokenbalance = Token.balanceOf(address(this));// / 10**uint256(depositTokenDecimals);

        for (uint256 i = 0; i < allowedLockPeriods.length; i++) {
            uint256 _days = allowedLockPeriods[i];
            LockPeriodParams memory params = lockPeriodParams[_days];
            if (!params.fixedBasisPoints) {
                uint256 multiplier = tokenbalance / params.stepSize;
                uint256 minusValue = multiplier * params.decrementStep;

                if (minusValue <= params.maxRate - params.minRate) {
                    allocation[_days] = params.maxRate - minusValue;
                } else {
                    allocation[_days] = params.minRate;
                }
                lockPeriodParams[_days].percentageBasisPoints = allocation[_days];
            }
        }
    }

    // Функция для просмотра параметров периода блокировки
    function getLockPeriodParams(uint256 _days) external view returns (LockPeriodParams memory) {
        require(isLockPeriodAllowed(_days), "Lock period not found");
        return lockPeriodParams[_days];
    }

    // Функция для установки штрафа за досрочное снятие
    function setDeductionPercentage(uint256 percentageBasisPoints) public onlyOwner {
        require(percentageBasisPoints <= 10000, "Invalid percentage");
        deductionPercentage = percentageBasisPoints;
    }
    function setTaxReceiver(address _newTaxReceiver) public onlyOwner {
        taxreceiver = _newTaxReceiver;
    }
    function emergencyWithdrawTokens(IERC20 _token, uint256 _amount) public onlyOwner {
        require(_token.balanceOf(address(this)) >= _amount, "Insufficient balance");
        _token.transfer(msg.sender, _amount);
    }

    function emergencyWithdrawWei(uint256 _amount) public onlyOwner {
        require(address(this).balance >= _amount, "Insufficient ether balance");
        payable(msg.sender).transfer(_amount);
    }

    function addSpam(address _addr) public onlyOwner {
        require(_addr != address(0), "Invalid address"); // Защита от нулевого адреса
        isSpam[_addr] = true; // Отмечаем адрес как спам
    }

    function removeSpam(address _addr) public onlyOwner {
        require(_addr != address(0), "Invalid address"); // Защита от нулевого адреса
        isSpam[_addr] = false; // Снимаем отметку спама
    }

    function convertTokenAToTokenB(
        uint256 inAmountTokenA,
        uint8 tokenADecimals,
        uint8 tokenBDecimals
    ) public pure returns (uint256 outAmountTokenB) {
        if (tokenADecimals > tokenBDecimals) {
            // Если у TokenA больше десятичных знаков, делим на 10^(разница)
            uint256 difference = tokenADecimals - tokenBDecimals;
            outAmountTokenB = inAmountTokenA / (10 ** difference);
        } else if (tokenADecimals < tokenBDecimals) {
            // Если у TokenB больше десятичных знаков, умножаем на 10^(разница)
            uint256 difference = tokenBDecimals - tokenADecimals;
            outAmountTokenB = inAmountTokenA * (10 ** difference);
        } else {
            // Если количество десятичных знаков одинаковое, просто возвращаем входное значение
            outAmountTokenB = inAmountTokenA;
        }
    }
    receive() external payable{	}
}