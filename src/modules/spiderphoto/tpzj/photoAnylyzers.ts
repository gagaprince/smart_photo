import { Anylyzer } from '../spider';
import cheerio from 'cheerio';
export class PhotoIndexAnylyzer implements Anylyzer {
  anylyse(html: string) {
    const $ = cheerio.load(html);
    const listNav = $('.list_nav').eq(0);
    const listLi = listNav.find('li');
    const indexUrls = new Array();
    for (let i = 0; i < listLi.length; i++) {
      const liTag = listLi.eq(i);
      const url = liTag.find('a').attr('href');
      const type = liTag.find('a').text();
      indexUrls.push({ url, type });
    }
    return indexUrls;
  }
}

export class PhotoOneTypeAnylyzer implements Anylyzer {
  anylyse(html: string) {
    const $ = cheerio.load(html);
    const pages = $('.pages');
    const thisclass = pages.find('.thisclass');
    const desli = thisclass.next();
    const typeKey = desli.find('a').attr('href');
    const typeIndex = typeKey?.split('_')[1];

    const pageinfo = pages.find('.pageinfo');
    const total = pageinfo.find('strong').html();

    return { typeIndex, total };
  }
}

export class PhotoOnePageAnylyzer implements Anylyzer {
  anylyse(html: string) {
    const $ = cheerio.load(html);
    const box = $('.list_con_box_ul');
    const aTags = box.find('a').filter(function(i, el) {
      return !!$(el).attr('title');
    });

    return aTags
      .map(function(i, el) {
        return {
          picUrl: $(el).attr('href'),
          name: $(el).attr('title'),
        };
      })
      .get();
  }
}

export class PhotoDetailPageAnylyzer implements Anylyzer {
  anylyse(html: string) {
    if (html) {
      const $ = cheerio.load(html);
      const imgUrls = $('#bigpic_all')
        .find('img')
        .map((i, el) => {
          return $(el).attr('src');
        })
        .get();
      console.log(imgUrls);
      // const imgUrl = $('#bigpicimg').attr('src');
      const aTag = $('a').filter(function(i, el) {
        return $(el).text() === '下一页';
      });
      let nextUrl = 'init';
      if (aTag) {
        nextUrl = aTag.attr('href') || 'init';
        console.log(nextUrl);
      }

      const hot = $('.article_info')
        .find('label')
        .text()
        .split('\n')[1]
        .trim();
      return { imgUrls, nextUrl, hot: +hot };
    }
    return {};
  }
}
