"use client";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import "./styles.css";

const Page: React.FC = () => {
  return (
    <main>
      <div className="mb-5 text-2xl font-bold">About</div>

      <div
        className={twMerge(
          "mx-auto mb-5 w-full md:w-2/3",
          "flex justify-center"
        )}
      >
        <Image
          src="/images/avatar.png"
          alt="Example Image"
          width={350}
          height={350}
          priority
          className="rounded-full border-4 border-slate-500 p-1.5"
        />
      </div>
      <div className="rainbow-text text-center">
        これはサンプルです。自作CSSスタイルを適用してキラキラさせています。
      </div>
      <div>逆にこれは無装飾文字です。一切のclassName指定をしていません。</div>
      <div className="mt-5 text-right font-bold">以下はコードです</div>
      <div className="code-block">
        {`<div className="bg-slate-800 py-2">
  <div className={twMerge(
    "mx-4 max-w-2xl md:mx-auto",
    "flex items-center justify-between",
    "text-lg font-bold text-white"
  )}>
    <div>
      <Link href="/">
        <FontAwesomeIcon icon={faFish} className="mr-1" />
        ???のブログ
      </Link>
    </div>
    <div>About</div>
  </div>
</div>`}
      </div>
      <div className="mt-5 text-right font-bold">以下はリストです</div>
      <ul>
        <li>リスト1</li>
        <li>リスト2</li>
        <li>リスト3</li>
      </ul>
      <div className="mt-5 text-right font-bold">以下は引用です</div>
      <blockquote>
        これは
        <a href="https://example.com" className="underline">
          引用元
        </a>
        です。
      </blockquote>
      <div className="mt-5 text-right font-bold">以下は表です</div>
      <table>
        <thead>
          <tr>
            <th>項目1</th>
            <th>項目2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>値1</td>
            <td>値2</td>
          </tr>
          <tr>
            <td>値3</td>
            <td>値4</td>
          </tr>
        </tbody>
      </table>
      <div className="mt-5 text-right font-bold">以下はリンクです</div>
      <div>
        <a href="https://example.com" className="underline">
          こちら
        </a>
        をクリックしてください。
      </div>
      <div className="mt-5 text-right font-bold">以下は画像です</div>
      <div className="flex justify-center">
        <Image
          src="/images/avatar.png"
          alt="Example Image"
          width={350}
          height={350}
          priority
          className="rounded-full border-4 border-slate-500 p-1.5"
        />
      </div>
      <div>では、ここから日本語の文章が始まります。</div>
      <div>
        私は今グスターヴ・ホルストの惑星の有名な木星ではない部分を聞いています。多分土星ですが、わざわざタイトルを見に行く気にまではなりません。でもなんかどんちゃん云っています。なので冥王星とか、確かあれは神秘的とか言って全編がppで演奏されるような指示がなされていたはずですが、あのような部分ではないので、多分土星で間違っていないと思います。
      </div>
      <div className="mt-5 bg-gray-500 p-5 text-lg font-light text-white">
        最近、というか年末はRTA(Real Time
        Attack)イベントが多くて楽しめました。完璧に楽しめたかと言うと微妙で、私は年末インフルエンザにかかっており今もなおその症状が若干残っているのですがなのでちょっと完璧ではなくアーカイブを追う日々なのですがでも楽しかったです。特にすごかったのは4d
        golfでした。ゴルフ系はいつも目を疑うようなショートカットが発生しやすいような気がしているのですが、今回は4dになってしまって限界突破していました。これはいちばん有名なRTAinJapanの話ですが、年明けからのレイドRTAマラソンも面白かったですし、RTAinJapanからレイドが繋がれていって最終的にたどり着いた福岡のRTAイベントも面白かったです。まあ半分寝てましたが。。。。
      </div>
      <div>
        先程も申したように私年末はインフルエンザでまともに過ごせておらずそれこそ外出は25日に一回外に出たきりなのですが、これでも改善されたほうで、いや冬休みだから、年末だからまあおかしくはないんですがそれでも普通休みとなると一切外出することがないのでこれはかなり珍しい方で、しかも私から誘っていますから相当に変です。\
        <div className="rainbow-text">
          この猫(狸)の画像微妙に憎たらしくていいですよね。センスあると思います。完全なプロンプト掲載しててほしいものです。
        </div>
      </div>
    </main>
  );
};

export default Page;
