/* Valid parentheses - Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.
 */
const isValid = (s) => {
    const stack = []
    const bracketMap = {
        ')': '(',
        '}': '{',
        ']': '['
    };

    for (let i = 0; i < s.length; i++) {
        const currentBracket = s[i]
        if (bracketMap.hasOwnProperty(currentBracket)) {
            // If it's a closing bracket
            const topElement = stack.length === 0 ? '#' : stack.pop();
            if (bracketMap[currentBracket] !== topElement) {
                return false;
            }
        } else {
            // If it's an opening bracket
            stack.push(currentBracket);
        }
    }

    return stack.length === 0
};

/* Decode String - Given an encoded string, return its decoded string.

The encoding rule is: k[encoded_string], where the encoded_string inside the square brackets is being repeated exactly k times. Note that k is guaranteed to be a positive integer.
 */
/**
 * @param {string} s
 * @return {string}
 */
const decodeString = (s) => {
    const stack = []
    for (const char of s) {
        if (char !== ']') {
            //  keep pushing till the closing brakcet
            stack.push(char)
            continue
        }
        //  found a closing bracket

        let stackTop = stack.pop()
        let currStr = ''

        //  find string till the last open bracket
        while (stackTop !== '[') {
            currStr = stackTop + currStr
            stackTop = stack.pop()
        }

        //  find the number
        let num = ''
        stackTop = stack.pop()
        while (!Number.isNaN(Number(stackTop))) {
            num = stackTop + num
            stackTop = stack.pop()
        }

        //  notice we popped an extra element
        stack.push(stackTop)

        //  push for futher travel
        stack.push(currStr.repeat(Number(num)))
    }

    return stack.join('')
};

/* Remove All Adjacent Duplicates in String  - You are given a string s and an integer k, a k duplicate removal consists of choosing k adjacent and equal letters from s and removing them, causing the left and the right side of the deleted substring to concatenate together.

We repeatedly make k duplicate removals on s until we no longer can.

Return the final string after all such duplicate removals have been made. It is guaranteed that the answer is unique.
 */
/**
 * @param {string} s
 * @param {number} k
 * @return {string}
 */
const removeDuplicates = (s, k) => {
    if (s.length < k) {
        return s
    }

    //  keep char and freq
    const stack = []

    for (const char of s) {
        if (stack.length && char === stack.at(-1)[0]) {
            //  last char is same, increase the freq
            stack.at(-1)[1]++

            //  remove as per condition
            if (stack.at(-1)[1] === k) {
                stack.pop()
            }
        } else {
            stack.push([char, 1])
        }
    }

    //  find leftover chars
    let res = ''
    for (const [char, count] of stack) {
        res += char.repeat(count)
    }

    return res
};

/* Daily Temperatures - Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.
 */
/**
 * @param {number[]} temperatures
 * @return {number[]}
 */
const dailyTemperatures = (temps) => {
    const stack = []
    const answer = Array(temps.length).fill(0)

    for (let i = 0; i < temps.length; i++) {
        while (stack.length && temps[stack[stack.length - 1]] < temps[i]) {
            //  found a warmer temp

            //  pop all the cold temp indexes and record the days
            const coldIndex = stack.pop()
            answer[coldIndex] = i - coldIndex
        }

        //  add this index as cold
        stack.push(i)
    }

    return answer
};

/* Online Stock Span - Design an algorithm that collects daily price quotes for some stock and returns the span of that stock's price for the current day.

The span of the stock's price in one day is the maximum number of consecutive days (starting from that day and going backward) for which the stock price was less than or equal to the price of that day.
 */
class StockSpanner {
    //  this stack will keep a price and its span
    stack = []
    next(price) {
        const { stack } = this

        //  includes the current day by default
        let days = 1

        //  find days when stock price was less than today to find total span for this price
        //  notice that there can be multiple spansw
        while (stack.length && stack.at(-1).price <= price) {
            //  count prev lower days also
            days += stack.pop().days
        }

        //  push the current one for future days
        stack.push({ price, days })
        return days
    }
}

/**
 * Your StockSpanner object will be instantiated and called as such:
 * var obj = StockSpanner()
 * var param_1 = obj.next(price)
 */



/* Next Greater Element - Given a circular integer array nums (i.e., the next element of nums[nums.length - 1] is nums[0]), return the next greater number for every element in nums.

The next greater number of a number x is the first greater number to its traversing-order next in the array, which means you could search circularly to find its next greater number. If it doesn't exist, return -1 for this number.
 */
/**
 * @param {number[]} nums
 * @return {number[]}
 */
const nextGreaterElements = (nums) => {
    const res = []
    const stack = []

    //  travel twice to avoid circular effect
    for (let i = 2 * nums.length - 1; i >= 0; i--) {
        //  find the index which has greater item than current item
        while (stack.length && nums[stack.at(-1)] <= nums[i % nums.length]) {
            stack.pop()
        }

        if (stack.length === 0) {
            //  even after 2 rounds no greater item found
            res[i % nums.length] = -1
        } else {
            //  top element of stack is the next greater item for current item
            res[i % nums.length] = nums[stack.at(-1)]
        }

        stack.push(i % nums.length)
    }

    return res
};

/* Minimum add to make parentheses valid - find the minimum number of parentheses to add to make a given string of parentheses valid
 */
const minAddToMakeValid = (s) => {
    const stack = []

    for (const char of s) {
        if (char === '(') {
            stack.push(char)
        } else {
            if (stack.length > 0 && stack[stack.length - 1] === '(') {
                //  found a match
                stack.pop()
            } else {
                //  no match, add this parenthesis for calculation
                stack.push(char)
            }
        }
    }

    //  unmatched parentheses are still in stack
    return stack.length
};

/* Min remove to make valid parentheses - Given a string s of '(' , ')' and lowercase English characters.

Your task is to remove the minimum number of parentheses ( '(' or ')', in any positions ) so that the resulting parentheses string is valid and return any valid string.

Formally, a parentheses string is valid if and only if:

It is the empty string, contains only lowercase characters, or
It can be written as AB (A concatenated with B), where A and B are valid strings, or
It can be written as (A), where A is a valid string.
 */

/**
 * @param {string} s
 * @return {string}
 */
const minRemoveToMakeValid = (s) => {
    s = s.split('')

    const stack = []

    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') {
            //  keep the position 
            stack.push(i)
        } else if (s[i] === ')') {
            if (stack.length) {
                stack.pop()
            } else {
                //  remove the invalid closing bracket
                s[i] = ''
            }
        }
    }

    for (let position of stack) {
        //  remove the invalid opening bracket
        s[position] = ''
    }

    return s.join('')
};

/* Asteroid Collision - We are given an array asteroids of integers representing asteroids in a row.

For each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed.

Find out the state of the asteroids after all collisions. If two asteroids meet, the smaller one will explode. If both are the same size, both will explode. Two asteroids moving in the same direction will never meet.
 */

/**
 * @param {number[]} asteroids
 * @return {number[]}
 */
const asteroidCollision = (asteroids) => {
    // Initialize an empty stack to keep track of asteroids
    const stack = []

    // Iterate through each asteroid in the input array
    for (const a of asteroids) {
        // Check if the current asteroid is moving to the left (negative value)
        if (a < 0) {
            // Handle collisions with asteroids moving to the right (positive values) in the stack
            while (stack.length > 0 && stack.at(-1) > 0 && stack.at(-1) < -a) {
                // The current asteroid will destroy the asteroid at the top of the stack
                stack.pop()
            }

            // Check if the current asteroid annihilates the asteroid at the top of the stack
            if (stack.length > 0 && stack.at(-1) + a === 0 && stack.pop()) {
                // If the top asteroid is completely destroyed, continue to the next iteration
                continue
            }

            // Check if the current asteroid is smaller than the asteroid at the top of the stack
            if (stack.length > 0 && stack.at(-1) > 0 && stack.at(-1) > -a) {
                // The current asteroid is destroyed, continue to the next iteration
                continue
            }
        }

        // If the current asteroid survives the collision checks, push it onto the stack
        stack.push(a)
    }

    // Return the remaining asteroids after collisions
    return stack
};

/* Sum of Subarray Minimums - Given an array of integers arr, find the sum of min(b), where b ranges over every (contiguous) subarray of arr. Since the answer may be large, return the answer modulo 109 + 7.
 */
/**
 * @param {number[]} arr
 * @return {number}
 */
const sumSubarrayMins = (arr) => {
    const mod = 10 ** 9 + 7;
    const stack = [];
    const n = arr.length;
    const left = new Array(n);
    const right = new Array(n);

    // Calculate the nearest smaller element on the left
    for (let i = 0; i < n; i++) {
        // Keep popping elements from the stack while the current element is smaller
        while (stack.length > 0 && arr[i] <= arr[stack.at(-1)]) {
            stack.pop();
        }
        // If the stack is empty, there is no smaller element on the left
        // Otherwise, the nearest smaller element is the one at the top of the stack
        left[i] = stack.length === 0 ? -1 : stack.at(-1);
        // Push the current element's index onto the stack
        stack.push(i);
    }

    // Clear the stack for reuse
    stack.length = 0;

    // Calculate the nearest smaller element on the right
    for (let i = n - 1; i >= 0; i--) {
        // Keep popping elements from the stack while the current element is smaller
        while (stack.length > 0 && arr[i] < arr[stack.at(-1)]) {
            stack.pop();
        }
        // If the stack is empty, there is no smaller element on the right
        // Otherwise, the nearest smaller element is the one at the top of the stack
        right[i] = stack.length === 0 ? n : stack.at(-1);
        // Push the current element's index onto the stack
        stack.push(i);
    }

    let result = 0;

    // Calculate the contribution of each element to the final result
    for (let i = 0; i < n; i++) {
        // Add the product of the current element, its left, and right distances to the result
        result = (result + arr[i] * (i - left[i]) * (right[i] - i)) % mod;
    }

    // Return the final result
    return result;
}