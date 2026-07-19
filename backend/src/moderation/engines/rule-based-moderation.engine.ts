import { Injectable } from '@nestjs/common';
import { ModerationEngine } from './moderation-engine.interface';
import { ModerationResult } from '../moderation.types';

@Injectable()
export class RuleBasedModerationEngine
  implements ModerationEngine
{
  analyzeText(text: string): ModerationResult {
    const normalizedText = text.toLowerCase();

    const reasons: string[] = [];
    let score = 0;

    const scamExpressions = [
      'guaranteed profit',
      'guaranteed return',
      'free money',
      'double your money',
      'crypto signals',
      'send me bitcoin',
      'send me crypto',
    ];

    const spamExpressions = [
      'click here',
      'join now',
      'limited offer',
      'buy now',
      'subscribe now',
    ];

    const abusiveExpressions = [
      'idiot',
      'stupid',
      'moron',
      'fuck you',
      'kill yourself',
    ];

    if (
      scamExpressions.some((expression) =>
        normalizedText.includes(expression),
      )
    ) {
      reasons.push('Possible financial scam');
      score += 0.4;
    }

    if (
      spamExpressions.some((expression) =>
        normalizedText.includes(expression),
      )
    ) {
      reasons.push('Possible spam');
      score += 0.25;
    }

    if (
      abusiveExpressions.some((expression) =>
        normalizedText.includes(expression),
      )
    ) {
      reasons.push('Possible abusive language');
      score += 0.5;
    }

    if (
      normalizedText.includes('http://') ||
      normalizedText.includes('https://')
    ) {
      reasons.push('Contains external link');
      score += 0.2;
    }

    if (this.hasExcessiveUppercase(text)) {
      reasons.push('Excessive uppercase text');
      score += 0.15;
    }

    if (this.hasExcessiveRepetition(text)) {
      reasons.push('Excessive repeated characters');
      score += 0.15;
    }

    score = Math.min(score, 1);

    if (score >= 0.7) {
      return {
        decision: 'rejected',
        score,
        reasons,
      };
    }

    if (score >= 0.3) {
      return {
        decision: 'flagged',
        score,
        reasons,
      };
    }

    return {
      decision: 'approved',
      score,
      reasons,
    };
  }

  private hasExcessiveUppercase(text: string): boolean {
    const letters = text.match(/\p{L}/gu);

    if (!letters || letters.length < 10) {
      return false;
    }

    const uppercaseLetters =
      text.match(/\p{Lu}/gu)?.length ?? 0;

    return uppercaseLetters / letters.length > 0.7;
  }

  private hasExcessiveRepetition(text: string): boolean {
    return /(.)\1{5,}/i.test(text);
  }
}
